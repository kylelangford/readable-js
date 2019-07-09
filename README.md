# Readable JS

An accessiblity plugin Readable.js looks to provide users with the ability to adjust the type as they need while providing developers a toolset to extend.

## Demo

You can see Readable in action at http://www.readable-js.com

## How do I use it?

```javascript
// Select a Target Element
var myElement = document.querySelector('.make-readable');

// construct an instance of Readable, passing the element
var readable = new Readable(myElement);

// initialise
readable.init();
```

### Include Script

```html
<script src="assets/js/readable.min.js"></script>
```

## How does it work?

```javascript
readable.options = {
  elem: '.make-readable p',
  title: 'Change Typesetting',
  defaultStyles: true,
  namespace: 'readable',
  inputs: [],
  templates: [],
};
```

### Options

- `elem` Test title.
- `title` List of titles of test suites.
- `defaultStyles` True if test is succeed, false otherwise.
- `namespace` True if test is skipped.
- `inputs` Test duration.
- `templates` Pass obj.

### Props

```html
id="${input.id}"
```

```javascript
inputs: [
  {
    type: 'range',
    css: 'font-size',
    name: 'font-size',
    update: function(elem, v) {
      elem.style.fontSize = v + 'px';
    },
    min: 14,
    max: 36,
    step: 1,
    value: 24,
  },
],
```

- `type` Test title.
- `css` List of titles of test suites.
- `name` True if test is succeed, false otherwise.
- `update` True if test is skipped.
- `min` Test duration.
- `max` Pass obj.
- `step` Pass obj.
- `value` Pass obj.

#### Custom Properties

Any property can be added to the input and accessed in the template.

### Update Function

Callback function that will fire on update.

```javascript
update: function(elem, value) {
  elem.style.fontSize = value + 'px';
}
```

### Templates

```javascript
templates: [
  {
    type: 'range',
    html: `<label class="${input.labelClass}" for="${input.name}">${input.label} <span>${input.value}</span></label>
           <input id="${input.id}" name="${input.name}" class="${input.class}" type="range"  min="${input.min}" max="${input.max}" step="${input.step}" />`,
  },
  {
    type: 'checkbox',
    html: `<input id="${input.id}" type="checkbox" name="${input.name}" value="${input.value}" class="${input.class}" />
           <label class="${input.labelClass}" for="${input.name}">${input.label}</label>`,
  },
],
```

## Themes

```scss
.tools {
  position: absolute;
  top: 0;
  right: -170px;
  z-index: 999;
  padding: 8px;
  margin: 8px;
  border: 2px solid #dcdcdc;
  border-radius: 3px;
  background-color: white;

  &:hover {
    cursor: pointer;
  }
}

.input-group {
  margin-top: 8px;
  margin-bottom: 8px;

  label {
    font-size: 12px;
    font-weight: bold;
  }

  .input-radio {
    display: inline-block;
  }

  .input-slider {
    display: block;
  }
}
```

## Built With

- Vanilla JS

## Contributing

Please read [CONTRIBUTING.md] for details on our code of conduct, and the process for submitting pull requests to us. (coming soon)

## Author

- **Kyle Langford** - [kylelangford.com](http://www.kylelangford.com)

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details
