'use strict';

var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();

var supportSw = function supportSw() {
  var isLocalhost = Boolean(window.location.hostname === 'localhost' ||
  // IPv6
  window.location.hostname === '[::1]' ||
  // IPv4
  window.location.hostname.match(/^127(?:\\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));
  var hasSw = Boolean('serviceWorker' in navigator);
  return hasSw && (window.location.protocol === 'https:' || isLocalhost);
};

var Register = function () {
  function Register(options) {
    classCallCheck(this, Register);

    this.options = Object.assign({}, Register.defaultOptions, options);
    this.scriptName = String(this.options.filename);
    if (supportSw()) {
      this.init();
    } else {
      console.warn('Browser does not support serviceWorker.Please use Chrome or FireFox.');
    }
  }

  createClass(Register, [{
    key: 'init',
    value: function init() {
      navigator.serviceWorker.register(this.scriptName).then(function (registration) {
        console.log('Registered events at scope: ', registration.scope);
      }).catch(function (err) {
        console.error('Error during service worker registration:', err);
        return Promise.reject(err);
      });
    }
  }]);
  return Register;
}();

Register.defaultOptions = {
  filename: ''
};

module.exports = Register;
