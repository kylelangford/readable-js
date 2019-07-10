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

  /**
   * Simple Two Way Binding
   * https://www.wintellect.com/data-binding-pure-javascript/
   * @private
   */
  var Binding = function(b) {
    var _this = this;
    this.elementBindings = [];
    this.value = b.object[b.property];

    this.valueGetter = function() {
      return _this.value;
    };

    this.valueSetter = function(val) {
      _this.value = val;
      for (var i = 0; i < _this.elementBindings.length; i++) {
        var binding = _this.elementBindings[i];
        binding.element[binding.attribute] = val;
      }
    };

    this.addBinding = function(element, attribute, event) {
      var binding = {
        element: element,
        attribute: attribute,
      };

      if (event) {
        element.addEventListener(event, function(event) {
          _this.valueSetter(parseInt(element[attribute]));
        });
        binding.event = event;
      }

      this.elementBindings.push(binding);
      element[attribute] = _this.value;
      return _this;
    };

    Object.defineProperty(b.object, b.property, {
      get: this.valueGetter,
      set: this.valueSetter,
    });

    b.object[b.property] = this.value;
  };

  /**
   * Get/Set Settings
   * @private
   */
  function setSettings(options) {
    // Put the object into storage
    localStorage.setItem('readableSettings', JSON.stringify(options, null, 2));
  }

  function getSettings() {
    // Retrieve the object from storage
    var retrievedSettings = localStorage.getItem('readableSettings');
    retrievedSettings = JSON.parse(retrievedSettings);
    return retrievedSettings;
  }

  /**
   * Some string helper functions
   * https://www.wintellect.com/data-binding-pure-javascript/
   * @private
   */
  function removeDashes(string) {
    string = string.replace(/-/g, ' ');
    string = string.replace(/_/g, ' ');

    return string;
  }

  function toTitleCase(str) {
    return str.replace(/\w\S*/g, function(txt) {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
  }

  function acronym(string) {
    string = removeDashes(string);
    var matches = string.match(/\b(\w)/g); // ['J','S','O','N']
    var acronym = matches.join(''); // JSON

    return acronym;
  }

  /**
   * Readable
   * Long Form readability tool for sighted users.
   * Exposes Typesettings, so the user can adjust to their own personal needs
   * Saves settings in local storage
   * @constructor
   * @param {DOMElement} elem the header element
   * @param {Object} options options for the widget
   */
  function Readable(elem, options) {
    // Check for Saved Settings
    var settings = getSettings();

    console.log('settings', settings);
    console.log('Readable', Readable.options);

    if (settings) {
      settings.elem = this.elem;
      options = extend(options, settings);
    } else {
      options = extend(options, Readable.options);
    }

    // Store Options
    this.initialised = false;
    this.targetClass = elem;
    this.namespace = options.namespace;
    this.elem = this.elem; // This is not being recorded in the save
    this.title = options.title;
    this.addRules = options.addRules;
    this.presets = options.presets;
    this.defaultStyles = options.defaultStyles;
    this.inputs = options.inputs.map(function(input) {
      input.id =
        options.namespace + '-' + input.type + '-' + acronym(input.name);
      input.class =
        options.namespace + '--' + input.type + '-' + acronym(input.name);
      input.label = toTitleCase(removeDashes(input.name)) + ':';
      input.labelClass = options.namespace + '--label-' + acronym(input.name);
      return input;
    });

    console.log('this', this);
  }

  Readable.prototype = {
    constructor: Readable,

    /**
     * Initialize Component
     * @private
     */
    init: function() {
      if (!Readable.isSupported) {
        return;
      }

      if (this.defaultStyles) {
        this.addDefaultStyles();
        this.addTics();
      }

      this.createWidget(this.targetClass);

      // defer event registration to handle browser
      // potentially restoring previous scroll position
      // setTimeout(this.attachEvent.bind(this), 100);
      setTimeout(this.attachEvent.bind(this), 100);

      console.log('init this', this);

      return this;
    },

    /**
     * Destroy Component
     * @private
     */
    destroy: function() {
      // var element = document.getElementById(elementId);
      document.removeEventListener('change');
      // element.parentNode.removeChild(element);
    },

    /**
     * Generates Widget
     * @private
     */
    createWidget: function(target) {
      if (target) {
        let widget = document.createElement('div');
        let inputList = document.createElement('div');
        let title = document.createElement('small');
        let button = document.createElement('button');

        // Create Widget Elemt
        widget.id = this.namespace;
        widget.classList.add(this.namespace);

        // Add Title
        title.innerHTML = this.title;
        widget.appendChild(title);

        // Add Input Container
        widget.appendChild(inputList);

        // Add Button
        button.id = 'save';
        button.innerHTML = 'Save';
        widget.appendChild(button);

        // Add Markup to Page
        target.appendChild(widget);

        this.createFormElements(inputList);
      } else {
        // throw err
      }
    },

    addPresets: function() {
      let presets = [
        { name: 'Design', age: 2 },
        { name: 'Big', age: 8 },
        { name: 'Small', age: 1 },
      ];
    },

    /**
     * Generates Form Inputs
     * @private
     */
    createFormElements: function(container) {
      /*
       * Input Templates
       * https://wesbos.com/template-strings-html/
       */

      const inputs = Readable.options.inputs;

      // Add Inputs
      inputs.forEach(function(input, index) {
        let markup = document.createElement('div');
        var type = input.type;
        var render = Readable.options.templates[type];

        markup.classList.add('input-group');
        markup.innerHTML = render(input);
        markup.classList.add('range');
        // Add Markup
        container.appendChild(markup);
      });

      // Bind Inputs
      this.bindInputs(inputs);
    },

    /**
     * Binds Input Data to Model
     * @private
     */
    bindInputs: function(inputs) {
      inputs.forEach(function(input, index) {
        var selector = '.' + input.labelClass + ' span';
        var myInput = document.getElementById(input.id);
        var myLabel = document.querySelector(selector);
        var styleBind = document.querySelector('.make-readable p');

        new Binding({
          object: Readable.options.inputs[index],
          property: 'value',
        })
          .addBinding(myInput, 'value', 'change')
          .addBinding(myLabel, 'innerHTML');
      });
    },

    /**
     * Handles Event Delegation
     * @private
     */
    attachEvent: function() {
      if (!this.initialised) {
        this.initialised = true;
        var _this = this;

        var signal = new CustomEvent('bang');

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

            inputs.forEach(function(input) {
              if (event.target.matches('#' + input.id)) {
                targetElem.forEach(function(elem) {
                  input.update(elem, v);
                });
              }
            });
          },
          false
        );

        document.addEventListener(
          'click',
          function(event) {
            if (event.target.matches('#save')) {
              setSettings(_this);
            }
          },
          false
        );
      }
    },

    addDefaultStyles: function() {
      // Default Styles
      var style = document.createElement('style');
      style.innerHTML =
        '.' +
        this.namespace +
        ' {' +
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
        'display: block;' +
        'font-size: 12px;' +
        'font-weight: bold;' +
        '}' +
        '.input-radio {' +
        'display: inline-block;' +
        '}' +
        '.input-slider {' +
        'display: block;' +
        '}';

      // Get the first script tag
      var ref = document.querySelector('head');

      // Insert our new styles before the first script tag
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
    elem: '.make-readable p',
    title: 'Change Typesetting',
    defaultStyles: true,
    addRules: true,
    namespace: 'readable',
    presets: [],
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
      {
        type: 'range',
        css: 'word-spacing',
        name: 'word-spacing',
        update: function(elem, v) {
          elem.style.wordSpacing = v + 'em';
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
        update: function(elem, v) {
          elem.style.letterSpacing = v / 10 + 'em';
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
        update: function(elem, v) {
          elem.style.lineHeight = v;
        },
        min: 1,
        max: 3,
        step: 0.1,
        value: 1.4,
      },
      // {
      //   type: 'checkbox',
      //   css: 'align',
      //   name: 'justify-type',
      //   value: null,
      //   update: function(elem) {
      //     var isChecked = document.getElementById('elementName').checked;

      //     if (isChecked) {
      //       elem.classList.add('active');
      //     } else {
      //       elem.classList.remove('active');
      //     }
      //   },
      // },
    ],
    templates: {
      range: function(input) {
        return `<label class="${input.labelClass}" for="${input.name}">${input.label} <span>${input.value}</span></label>
                <input id="${input.id}" name="${input.name}" class="${input.class}" type="range"  min="${input.min}" max="${input.max}" step="${input.step}" />`;
      },
      checkbox: function(input) {
        return `<label class="${input.labelClass}" for="${input.name}">${input.label}</label>
                <input id="${input.id}" type="checkbox" name="${input.name}" value="${input.value}" class="${input.class}" />`;
      },
      select: function(input) {
        return `
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
      },
    },
  };

  Readable.isSupported =
    typeof features !== 'undefined' && features.bind && features.classList;

  // Just return a value to define the module export.
  // This example returns an object, but the module
  // can return a function as the exported value.
  return Readable;
});
