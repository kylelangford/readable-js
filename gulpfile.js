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

// Settings
var cssOutPutStyle = 'expanded';
// var cssOutPutStyle = 'compressed';

// Tasks
gulp.task('css', gulp.series(css));
gulp.task('build', gulp.series(css, js));
gulp.task('publish', gulp.series(publish, publishMinified));
gulp.task('default', gulp.series('build', server, watch));

function createErrorHandler(name) {
  return function(err) {
    console.error('Error from ' + name + ' in compress task', err.toString());
  };
}

// Compile Scss into CSS
function css() {
  return gulp
    .src('./demo/src/scss/*.scss')
    .pipe(sourcemaps.init())
    .pipe(
      sass({
        outputStyle: cssOutPutStyle,
        sourceMap: true,
      })
    )
    .pipe(sourcemaps.write('./maps'))
    .pipe(gulp.dest('./demo/assets/css'))
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
  return gulp
    .src([
      './src/readable.js',
      './demo/src/js/vendor/prism.js',
      './demo/src/js/main.js',
    ])
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
    .pipe(gulp.dest('./demo/assets/js/'))
    .pipe(
      notify({
        title: 'JS Minified',
        message: 'All JS files in the theme have been minified.',
        onLast: true,
      })
    );
}

function publishMinified() {
  return gulp
    .src(['./src/readable.js'])
    .pipe(
      babel({
        presets: ['@babel/env'],
      })
    )
    .pipe(concat('readable.min.js'))
    .pipe(uglify())
    .on('error', createErrorHandler('uglify'))
    .pipe(gulp.dest('./dist/'))
    .pipe(
      notify({
        title: 'JS Minified',
        message: 'All JS files in the theme have been minified.',
        onLast: true,
      })
    );
}

function publish() {
  return gulp
    .src(['./src/readable.js'])
    .pipe(
      babel({
        presets: ['@babel/env'],
      })
    )
    .pipe(gulp.dest('./dist/'))
    .pipe(
      notify({
        title: 'JS Minified',
        message: 'All JS files in the theme have been minified.',
        onLast: true,
      })
    );
}

/**
 * Start a server with LiveReload to preview the site in
 */
function server(done) {
  browser.init({
    server: {
      baseDir: './demo/',
      port: 3000,
    },
  });
  done();
}

// Watch for file changes
function watch() {
  gulp
    .watch(['./demo/src/scss/**/*.scss'])
    .on('change', gulp.series(css, browser.reload));
  gulp
    .watch(['./demo/src/js/**/*.js', './src/*.js'])
    .on('change', gulp.series(js, browser.reload));
  gulp.watch(['./demo/*.html']).on('change', gulp.series(browser.reload));
}
