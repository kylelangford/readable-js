# Readable JS

An accessiblity plugin Readable.js looks to provide users with the ability to adjust the type as they need while providing developers a toolset to extend.

## Demo

You can see Readable in action at http://readable-js.com

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
<script src="assets/js/scripts.min.js"></script>
```

## How does it work?

```javascript
readable.options = {
	elem: '.make-readable p',
	title: 'Change Typesetting',
	defaultStyles: true,
	namespace: 'readable',
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
};
```

## Templates

```javascript
templates: [
  {
    type: 'range',
    html: `<label class="${input.labelClass}" for="${input.name}">${input.label} <span>${input.value}</span></label>
           <input id="${input.id}" name="${input.name}" class="${input.class}" type="range"  min="${input.min}" max="${input.max}" step="${input.step}" />`,
  },
  {
    type: 'checkbox',
    html: ``,
  },
],
```

## Themes

```css
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

	// width: 150px;
	// height: auto;
	// overflow: visible;
	// transition: all .25s ease-in;

	// * {
	//   transition: all .25s ease-in;
	// }

	&:focus {
	}

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
		// margin: 16px 0
	}

	.dark-mode & {
		label {
			color: white;
		}
	}
}
```

## Built With

- Vanilla JS

## Contributing

Please read [CONTRIBUTING.md] for details on our code of conduct, and the process for submitting pull requests to us. (coming soon)

## Versioning

We use [SemVer](http://semver.org/) for versioning. For the versions available, see the [tags on this repository](https://github.com/your/project/tags). (coming soon)

## Author

- **Kyle Langford** - [kylelangford.com](http://kylelangford.com)

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details
