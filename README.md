# Readable JS (alpha)

An accessiblity plugin Readable.js looks to provide users with the ability to adjust the type as they need while providing developers a toolset to extend.

#### note:

This project is actively being developed. I will remove the (alpha) once everything is documented and cleaned up.

## Demo

You can see Readable in action at [www.readable-js.com/demo](http://www.readable-js.com/demo)

## How do I use it?

```javascript
// Select a target to append widget
var parent = document.querySelector('.make-readable');
var elements = document.querySelectorAll('.make-readable p');

// construct an instance of Readable, passing the element
var readable = new Readable(parent, elements, options);

// initialise
readable.init();
```

Readble will work out of the box with its default settings. The following is only needed if you want to customize what is provided.

### Include Script

```html
<script src="assets/js/readable.min.js"></script>
```

## How does it work?

```javascript
readable.options = {
  parent: '.message',
  namespace: 'readable',
  title: 'Change Typesetting',
  defaultStyles: true,
  addRules: true,
  inputs: [],
  elements: [],
  templates: [],
};
```

### Options

- `parent` Set where the widget will be appended.
- `namespace` Set namespace for component, used to scaffold out component classes.
- `title` Set block title.
- `defaultStyles` True or false, enable basic styling.
- `inputs` Array, form elements to create.
- `elements` Array, elements to style.
- `templates` Array, form element will render using these templates. Type must match.

### Props

```html
id="${input.id}"
```

#### Range Sliders

```javascript
inputs: [
  {
    type: 'range',
    css: 'font-size',
    name: 'font-size',
    update: function(elements, v) {
      elements.forEach(function(elem) {
        elem.style.fontSize = v + 'px';
      });
    },
    min: 14,
    max: 36,
    step: 1,
    value: 24,
  },
  {
    type: 'range',
    css: 'word-spacing',
    name: 'word-spacing',
    update: function(elements, v) {
      elements.forEach(function(elem) {
        elem.style.wordSpacing = v + 'em';
      });
    },
    min: 0,
    max: 3,
    step: 0.1,
    value: 0,
  },
  {
    type: 'range',
    css: 'letter-spacing',
    name: 'letter-spacing',
    update: function(elements, v) {
      elements.forEach(function(elem) {
        elem.style.letterSpacing = v / 10 + 'em';
      });
    },
    min: 0,
    max: 3,
    step: 0.1,
    value: 0,
  },
  {
    type: 'range',
    css: 'line-height',
    name: 'line-height',
    update: function(elements, v) {
      elements.forEach(function(elem) {
        elem.style.lineHeight = v;
      });
    },
    min: 1,
    max: 3,
    step: 0.1,
    value: 1.4,
  },
],
```

#### Base Properties

- `type` Used to match with template.
- `css` CSS class .
- `name` Name of form element.
- `update` Callback function.
- `value` Set initial value.

#### Range Slider Properties

- `min` Set min value.
- `max` Set max value.
- `step` Set step value.

#### Custom Properties

Any property can be added to the input and accessed in the template through the input obj.

#### Update Function

Callback function that will fire on update. Elem refers to Readable.elem, document is available.

```javascript
update: function(elements, v) {
  elements.forEach(function(elem) {
    elem.style.fontSize = v + 'px';
  });
},
```

### Templates

```javascript
templates: {
  range: function(input) {
    return `<label class="${input.labelClass}" for="${input.name}">${input.label} <span>${input.value}</span></label>
            <input id="${input.id}" name="${input.name}" class="${input.class}" type="range"  min="${input.min}" max="${input.max}" step="${input.step}" />`;
  },
},
```

## Styles

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

  input[type='radio'] {
    display: inline-block;
  }

  input[type='range'] {
    display: block;
  }
}
```

### Themes

Style with css

```css
/* Wrapper */
.input-group {
  /* Your Styles */
}

/* Convention */
.[namespace]--[element]-[name-acronym] {
  /* Your Styles */
}

/* Font size range slider example */
.readable--label-fs {
  /* Your Styles */
}

.readable--range-fs {
  /* Your Styles */
}
```

```html
<div class="input-group range">
  <label class="readable--label-fs" for="font-size"
    >Font Size: <span>24</span></label
  >
  <input
    id="readable-range-fs"
    name="font-size"
    class="readable--range-fs"
    type="range"
    min="14"
    max="36"
    step="1"
  />
</div>
```

## Built With

- Vanilla JS

## How can I contribute?

Please read [CONTRIBUTING.md] for details on our code of conduct, and the process for submitting pull requests to us. (coming soon)

## Author

- **Kyle Langford** - [www.kylelangford.com](http://www.kylelangford.com)

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details
