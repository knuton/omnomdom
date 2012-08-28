;(function (root) {

  var factory = function () {

    // Helper functions
    var slice = function (array, index) { return Array.prototype.slice.call(array, index); },
        isArray = function (arg) { return Object.prototype.toString.call(arg) === '[object Array]'; },
        find = function (collection, test, offset) {
          var result, i, l, item;
          for (i = offset || 0, l = collection.length; i < l; i++) {
            item = collection[i];
            if (test(item)) return item;
          }
          return null;
        };

    // Special properties
    var directProperties = {
          'class': 'className', className: 'className', defaultValue: 'defaultValue',
          'for': 'htmlFor', html: 'innerHTML', text: 'textContent', value: 'value'
        },
        booleanProperties = {
          checked: 1, defaultChecked: 1, disabled: 1, multiple: 1, selected: 1
        };

    function omnomdom (tag) {
      var text = find(arguments, function (arg) { return typeof arg === 'string'; }, 1),
          children = find(arguments, isArray, 1),
          builder = find(arguments, function (arg) { return typeof arg === 'function'; }, 1),
          properties = find(arguments, function (arg) { return typeof arg === 'object' && Object.prototype.toString.call(arg) !== '[object Array]'; }, 1);
      this.element = document.createElement(tag);
      if (text) this.append(text);
      if (properties) {
        for (name in properties) if (properties.hasOwnProperty(name)) this.set(name, properties[name]);
      }
      if (children) this.append(children);
      if (builder) builder.call(null, this);
    }

    omnomdom.build = function () {
      var ctor = function () {};
      ctor.prototype = omnomdom.prototype;
      var builder = new ctor();
      omnomdom.apply(builder, slice(arguments, 0));
      return builder.build();
    }

    // Alias
    omnomdom.el = omnomdom.build;

    omnomdom.prototype.build = function () {
      return this.element;
    };

    omnomdom.prototype.el = function () {
      this.append(this.constructor.build.apply(null, slice(arguments, 0)));
    };

    omnomdom.prototype.text = function (text) {
      this.append(text);
    };

    omnomdom.prototype.append = function (node) {
      if (isArray(node)) {
        for (var i = 0, l = node.length; i < l; i++) this.append(node[i]);
      } else {
        if (typeof node === 'string') node = document.createTextNode(node);
        this.element.appendChild(node);
      }
      return this;
    };

    omnomdom.prototype.set = function (name, value) {
      var prop = directProperties[name];
      if (prop) this.element[prop] = value != null ? String(value) : '';
      else if (booleanProperties[name]) this.element[name] = Boolean(value);
      else if (value == null) this.element.removeAttribute(name);
      else this.element.setAttribute(name, String(value));
      return this;
    };

    return omnomdom;

  };

  // AMD
  if (typeof define === 'function' && define.amd) define(factory);
  // Global Object
  else root.omnomdom = factory();

})(this);
