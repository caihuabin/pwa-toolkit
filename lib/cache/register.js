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
    supportSw() && this._init();
  }

  createClass(Register, [{
    key: '_init',
    value: function _init() {
      this._load();
      this._online();
      this._offline();
    }
  }, {
    key: '_load',
    value: function _load() {
      var _this = this;

      window.addEventListener('load', function () {
        navigator.serviceWorker.register(_this.scriptName).then(function (registration) {
          console.log('Registered events at scope: ', registration.scope);
          _this._handleInstallingOrUpdating(registration);
          registration.onupdatefound = function () {
            return _this._handleInstallingOrUpdating(registration);
          };
        }).catch(function (err) {
          console.error('Error during service worker registration:', err);
          this.options.onError(err);
          return Promise.reject(err);
        });
      });
    }
  }, {
    key: '_handleInstallingOrUpdating',
    value: function _handleInstallingOrUpdating(registration) {
      var _this2 = this;

      var sw = registration.installing || registration.waiting;
      var onUpdateStateChange = function onUpdateStateChange() {
        switch (sw.state) {
          case 'redundant':
            {
              _this2.options.onUpdateFailed();
              sw.onstatechange = null;
            }
            break;
          case 'installing':
            {
              _this2.options.onUpdating();
            }
            break;
          case 'installed':
            {
              _this2.options.onUpdateReady();
            }
            break;
          case 'activated':
            {
              _this2.options.onUpdated();
              sw.onstatechange = null;
            }
            break;
        }
      };
      var onInstallStateChange = function onInstallStateChange() {
        switch (sw.state) {
          case 'redundant':
            {
              _this2.options.onInstallFailed();
              sw.onstatechange = null;
            }
            break;
          case 'installing':
            {
              // Installing, ignore
            }
            break;
          case 'installed':
            {
              // Installed, wait activation
            }
            break;
          case 'activated':
            {
              _this2.options.onInstalled();
              sw.onstatechange = null;
            }
            break;
        }
      };

      // No SW or already handled
      if (!sw || sw.onstatechange) return;

      var stateChangeHandler = void 0;
      if (registration.active) {
        onUpdateStateChange();
        stateChangeHandler = onUpdateStateChange;
      } else {
        onInstallStateChange();
        stateChangeHandler = onInstallStateChange;
      }
      sw.onstatechange = stateChangeHandler;
    }
  }, {
    key: '_online',
    value: function _online() {
      var _this3 = this;

      window.addEventListener('online', function () {
        return _this3.options.online();
      });
    }
  }, {
    key: '_offline',
    value: function _offline() {
      var _this4 = this;

      window.addEventListener('offline', function () {
        return _this4.options.offline();
      });
    }
  }]);
  return Register;
}();

Register.defaultOptions = {
  filename: '',
  onError: function onError() {},
  onInstalled: function onInstalled() {
    return console.log('serviceWorker:安装成功');
  },
  onInstallFailed: function onInstallFailed() {
    return console.log('serviceWorker:安装失败');
  },
  onUpdating: function onUpdating() {
    return console.log('serviceWorker:更新中...');
  },
  onUpdateReady: function onUpdateReady() {
    window.confirm('serviceWorker:更新完成，有新的资源可用，是否启用？') && Register.skipWaiting();
  },
  onUpdated: function onUpdated() {
    return window.location.reload();
  },
  onUpdateFailed: function onUpdateFailed() {
    return console.log('serviceWorker:更新失败');
  },
  online: function online() {},
  offline: function offline() {}
};

Register.skipWaiting = function (errback, callback) {
  navigator.serviceWorker.getRegistration().then(function (registration) {
    if (!registration || !registration.waiting) {
      errback && errback();
      return;
    }
    registration.waiting.postMessage({
      action: 'skipWaiting'
    });
    callback && callback();
  });
};

Register.update = function () {
  navigator.serviceWorker.getRegistration().then(function (registration) {
    return registration && registration.update();
  });
};

module.exports = Register;
