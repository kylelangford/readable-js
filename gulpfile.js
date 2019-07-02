var gulp = require('gulp');
const babel = require('gulp-babel');
var concat = require('gulp-concat');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var notify = require('gulp-notify');
var modernizr = require('gulp-modernizr');
var uglify = require('gulp-uglify');
var path = require('path');
var rimraf = require('rimraf');
var browser = require('browser-sync').create();
const prettier = require('gulp-prettier');

// Settings
var cssOutPutStyle = 'expanded';
// var cssOutPutStyle = 'compressed';

// Tasks
gulp.task('css', gulp.series(css));

gulp.task('validate', gulp.series(validate));

gulp.task('build', gulp.series(css, js));

gulp.task('default', gulp.series('build', server, watch));

// Compile Scss into CSS
function css() {
  return gulp
    .src('./src/scss/*.scss')
    .pipe(sourcemaps.init())
    .pipe(
      sass({
        outputStyle: cssOutPutStyle,
        sourceMap: true,
      })
    )
    .pipe(sourcemaps.write('./maps'))
    .pipe(gulp.dest('./dist/css'))
    .pipe(
      notify({
        title: 'SASS Compiled',
        message: 'All SASS files have been recompiled to CSS.',
        onLast: true,
      })
    );
}

// JS
function js() {
  function createErrorHandler(name) {
    return function(err) {
      console.error('Error from ' + name + ' in compress task', err.toString());
    };
  }

  return gulp
    .src(['src/js/readable.js', 'src/js/main.js'])
    .pipe(
      babel({
        presets: ['@babel/env'],
      })
    )
    .pipe(concat('scripts.min.js'))
    .pipe(sourcemaps.init())
    .pipe(uglify())
    .on('error', createErrorHandler('uglify'))
    .pipe(sourcemaps.write('./maps'))
    .pipe(gulp.dest('./dist/js/'))
    .pipe(
      notify({
        title: 'JS Minified',
        message: 'All JS files in the theme have been minified.',
        onLast: true,
      })
    );
}

function validate() {
  return gulp
    .src('./src/js/*.js')
    .pipe(
      prettier({
        // Normal prettier options, e.g.:
        singleQuote: true,
        trailingComma: 'all',
      })
    )
    .pipe(gulp.dest(file => file.base));
}

/**
 * Start a server with LiveReload to preview the site in
 */
function server(done) {
  browser.init({
    server: {
      baseDir: '.',
      port: 3000,
    },
  });
  done();
}

// Watch for file changes
function watch() {
  gulp
    .watch(['./src/scss/**/*.scss'])
    .on('change', gulp.series(css, browser.reload));
  gulp
    .watch(['./src/js/**/*.js'])
    .on('change', gulp.series(js, browser.reload));
  gulp.watch(['./*.html']).on('change', gulp.series(browser.reload));
}
