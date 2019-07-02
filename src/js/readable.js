(function(root, factory) {
  'use strict';

  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    // Node. Does not work with strict CommonJS, but
    // only CommonJS-like environments that support module.exports,
    // like Node.
    module.exports = factory();
  } else {
    // Browser globals (root is window)
    root.Readable = factory();
  }
})(typeof self !== 'undefined' ? self : this, function() {
  'use strict';

  /* exported features */
  var features = {
    bind: !!function() {}.bind,
    classList: 'classList' in document.documentElement,
  };

  /**
   * Check if object is part of the DOM
   * @constructor
   * @param {Object} obj element to check
   */
  function isDOMElement(obj) {
    return (
      obj && typeof window !== 'undefined' && (obj === window || obj.nodeType)
    );
  }

  /**
   * Extend.js
   * Merge defaults with user options
   * https://gist.github.com/cferdinandi/4f8a0e17921c5b46e6c4
   * @private
   * @param {Object} defaults Default settings
   * @param {Object} options User options
   * @returns {Object} Merged values of defaults and options
   */
  var extend = function(defaults, options) {
    var extended = {};
    var prop;

    for (prop in defaults) {
      if (Object.prototype.hasOwnProperty.call(defaults, prop)) {
        extended[prop] = defaults[prop];
      }
    }

    for (prop in options) {
      if (Object.prototype.hasOwnProperty.call(options, prop)) {
        extended[prop] = options[prop];
      }
    }

    return extended;
  };

  var checkForSettings = function() {
    // Retrieve the object from storage
    var retrievedSettings = localStorage.getItem('readableSettings');
    return retrievedSettings;
  };

  var createSettings = function(options) {
    // Put the object into storage
    localStorage.setItem('readableSettings', JSON.stringify(options));
  };

  var Binding = function(b) {
    var _this = this;
    this.element = b.element;
    this.value = b.object[b.property];
    this.attribute = b.attribute;
    this.valueGetter = function() {
      return _this.value;
    };

    this.valueSetter = function(val) {
      _this.value = val;
      _this.element[_this.attribute] = val;
    };

    if (b.event) {
      this.element.addEventListener(b.event, function(event) {
        _this.value = _this.element[_this.attribute];
      });
    }

    Object.defineProperty(b.object, b.property, {
      get: this.valueGetter,
      set: this.valueSetter,
    });

    b.object[b.property] = this.value;

    this.element[this.attribute] = this.value;
  };

  /**
   * Article readability tool for sighted users.
   * Exposes Typesettings, so the user can adjust to their own personal needs
   * Saves settings in local storage
   * @constructor
   * @param {DOMElement} elem the header element
   * @param {Object} options options for the widget
   */
  function Readable(elem, options) {
    var savedOptions = checkForSettings();

    // options = new settings // overwrite arguememt options
    if (savedOptions) {
      console.log('settings exist');
      options = extend(options, savedOptions);
    } else {
      console.log('use defaults');
      options = extend(options, Readable.options);
    }

    // Check for settings
    this.initialised = false;
    this.elem = elem;
    this.title = options.title;
    this.addRules = options.addRules;
    this.widgetClass = options.widgetClass;
    this.targetClass = options.targetClass;
    this.inputs = options.inputs;
  }

  Readable.prototype = {
    constructor: Readable,

    init: function() {
      if (!Readable.isSupported) {
        return;
      }

      var inputs = Readable.options.inputs;

      this.addDefaultStyles();
      this.createFormElement(inputs);
      this.addTics();

      // defer event registration to handle browser
      // potentially restoring previous scroll position
      // setTimeout(this.attachEvent.bind(this), 100);
      setTimeout(this.attachEvent.bind(this), 100);

      return this;
    },

    destroy: function() {
      // Remove Event Listeners and Markup
      document.removeEventListener('change');
      // var element = document.getElementById(elementId);
      // element.parentNode.removeChild(element);
    },

    /**
     * Attaches the scroll event
     * @private
     */
    attachEvent: function() {
      if (!this.initialised) {
        this.initialised = true;

        /*
         * https://javascript.info/bubbling-and-capturing
         * https://gomakethings.com/listening-for-click-events-with-vanilla-javascript/
         */

        document.addEventListener(
          'change',
          function(event) {
            var id = event.target.id;
            var elem = document.getElementById(id);
            var target = Readable.options.elem;
            var targetElem = document.querySelectorAll(target);
            var inputs = Readable.options.inputs;
            var v = elem.value;

            // Don't follow the link
            event.preventDefault();

            // Make this dynamic

            // if event.target matches one of the input keys else return
            if (event.target.matches('#slider-fs')) {
              targetElem.forEach(function(elem) {
                elem.style.fontSize = v + 'px';
              });

              // Update Tool
              // $('.ui-fs span').html(v);
            }

            if (event.target.matches('#slider-ls')) {
              targetElem.forEach(function(elem) {
                elem.style.letterSpacing = v / 10 + 'em';
              });

              // $('.ui-ls span').html(v);
            }

            if (event.target.matches('#slider-ws')) {
              targetElem.forEach(function(elem) {
                elem.style.wordSpacing = v + 'em';
              });

              // $('.ui-ws span').html(v);
            }

            if (event.target.matches('#slider-lh')) {
              targetElem.forEach(function(elem) {
                elem.style.lineHeight = v;
              });

              // $('.ui-lh span').html(v);
            }

            if (event.target.matches('#checkbox-jt')) {
              var isChecked = document.getElementById('elementName').checked;
              if (isChecked) {
                //checked
                // add Class
              } else {
                //unchecked
                // Remove Class
              }
            }
          },
          false
        );

        document.addEventListener(
          'click',
          function(event) {
            if (event.target.matches('#save')) {
              createSettings(Readable.options);
            }
          },
          false
        );
      }
    },

    /**
     * Generates Form Markup
     * @private
     */
    createFormElement: function(inputs) {
      /*
       * Input Templates
       * https://wesbos.com/template-strings-html/
       */

      let widget = document.createElement('div');
      let title = document.createElement('small');
      let button = document.createElement('button');
      let target = document.querySelector('.readable');

      let presets = [
        { name: 'Design', age: 2 },
        { name: 'Big', age: 8 },
        { name: 'Small', age: 1 },
      ];

      // Create Widget Elemt
      widget.id = 'readable-js';
      widget.classList.add('tools');

      // Add Title
      title.innerHTML = 'Adjust Typesetting';
      widget.appendChild(title);

      // Add Button
      button.id = 'save';
      button.innerHTML = 'Save';
      widget.appendChild(button);

      // Add Inputs
      inputs.forEach(function(input, index) {
        let markup = document.createElement('div');
        markup.classList.add('input-group');

        // spread operator to print attributes

        const range = `
          <label class="ui-fs" for="${input.name}">${input.label} <span>${input.value}</span></label>
          <input id="${input.id}" type="range" min="${input.min}" max="${input.max}" name="${input.name}" class="input-slider" />
        `;

        const checkbox = `
          <input id="${input.id}" type="checkbox" name="${input.name}" value="justify" class="input-checkbox" />
          <label for="${input.name}">${input.label}</label>
        `;

        const select = `
          <div class="input-group select">
          <label for="${input.name}">${input.label}</label>
          <select>
              ${presets.map(
                preset =>
                  `<option value=${presets.name}>${
                    presets.name
                  } is ${presets.age * 7}</option>`
              )}
          </select>
          </div>
        `;

        var myID = '#' + Readable.options.inputs[index].id;
        var myElement = document.getElementById(myID);

        console.log(myID);
        console.log(myElement);

        // Element Doesnt Exist Yet
        // new Binding({
        //   object: Readable.options.inputs[index],
        //   property: 'value',
        //   element: myElement,
        //   attribute: 'value',
        //   event: 'change',
        // });

        // if range
        if (input.type == 'range') {
          markup.innerHTML = range;
          markup.classList.add('range');
        } else {
          markup.innerHTML = checkbox;
          markup.classList.add('checkbox');
        }

        console.log(markup);

        // Add Inputs
        widget.appendChild(markup);
      });

      // Add Markup to Page
      target.appendChild(widget);
    },

    addDefaultStyles: function() {
      // Default Styles
      var style = document.createElement('style');
      style.innerHTML =
        '.tools {' +
        'position: absolute;' +
        'top: 0;' +
        'right: -170px;' +
        'z-index: 999;' +
        'padding: 8px;' +
        'margin: 8px;' +
        'border: 2px solid #DCDCDC;' +
        'border-radius: 3px;' +
        'background-color: white;' +
        '}' +
        '.input-group {' +
        'margin-top: 8px;' +
        'margin-bottom: 8px;' +
        '}' +
        '.input-group label {' +
        'font-size: 12px;' +
        'font-weight: bold;' +
        '}' +
        '.input-radio {' +
        'display: inline-block;' +
        '}' +
        '.input-slider {' +
        'display: block;' +
        '}';

      // // Get the first script tag
      var ref = document.querySelector('head');

      // // Insert our new styles before the first script tag
      ref.parentNode.insertBefore(style, ref);
    },

    addTics: function() {
      var rangeInputs = document.querySelectorAll('.range');

      rangeInputs.forEach(function(input) {
        var newElem = document.createElement('div');
        var ruler = createRules();
        input.appendChild(ruler);
      });

      function createRules() {
        var rulerElem = document.createElement('div');
        var fidelity = 5;
        var minRange = 0;
        var maxRange = 20;
        var delta = maxRange / fidelity;
        rulerElem.classList.add('ruler');

        for (var i = minRange; i <= maxRange; i += delta) {
          var tic = document.createElement('div');
          var ticSpan = document.createElement('span');
          ticSpan.innerHTML = i;
          tic.appendChild(ticSpan);
          rulerElem.appendChild(tic);
        }
        return rulerElem;
      }
    },
  };

  /**
   * Default options
   * @type {Object}
   */

  Readable.options = {
    elem: '.readable p',
    title: 'Adjust Typesetting',
    addRules: true,
    widgetClass: '.tools',
    targetClass: '.readable',
    inputs: [
      {
        css: 'font-size',
        type: 'range',
        id: 'slider-fs',
        label: 'Font Size:',
        min: 14,
        max: 36,
        step: 1,
        value: 24,
      },
      {
        css: 'word-spacing',
        type: 'range',
        id: 'slider-ws',
        name: 'word-spacing',
        label: 'Word Spacing:',
        min: 0,
        max: 3,
        step: 0.1,
        value: 0,
      },
      {
        css: 'letter-spacing',
        type: 'range',
        id: 'slider-ls',
        name: 'letter-spacing',
        label: 'Letter Spacing:',
        min: 0,
        max: 3,
        step: 0.1,
        value: 0,
      },
      {
        css: 'line-height',
        type: 'range',
        id: 'slider-lh',
        name: 'line-height',
        label: 'Line Height:',
        min: 1,
        max: 3,
        step: 0.1,
        value: 1.4,
      },
      {
        css: 'align',
        type: 'checkbox',
        id: 'checkbox-jt',
        name: 'justify-type',
        label: 'Justify Type:',
        value: false,
      },
    ],
  };

  Readable.isSupported =
    typeof features !== 'undefined' && features.bind && features.classList;

  // Just return a value to define the module export.
  // This example returns an object, but the module
  // can return a function as the exported value.
  return Readable;
});
