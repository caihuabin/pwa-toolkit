'use strict';

if (!Cache.prototype.add) {
  Cache.prototype.add = function add(request) {
    return this.addAll([request]);
  };
}

if (!Cache.prototype.addAll) {
  Cache.prototype.addAll = function addAll(requests) {
    var cache = this;

    // Since DOMExceptions are not constructable:
    function NetworkError(message) {
      this.name = 'NetworkError';
      this.code = 19;
      this.message = message;
    }
    NetworkError.prototype = Object.create(Error.prototype);

    return Promise.resolve().then(function () {
      if (arguments.length < 1) throw new TypeError();

      // Simulate sequence<(Request or USVString)> binding:
      var sequence = [];

      requests = requests.map(function (request) {
        if (request instanceof Request) {
          return request;
        } else {
          return String(request); // may throw TypeError
        }
      });

      return Promise.all(requests.map(function (request) {
        if (typeof request === 'string') {
          request = new Request(request);
        }

        var scheme = new URL(request.url).protocol;

        if (scheme !== 'http:' && scheme !== 'https:') {
          throw new NetworkError("Invalid scheme");
        }

        return fetch(request.clone());
      }));
    }).then(function (responses) {
      // TODO: check that requests don't overwrite one another
      // (don't think this is possible to polyfill due to opaque responses)
      return Promise.all(responses.map(function (response, i) {
        return cache.put(requests[i], response);
      }));
    }).then(function () {
      return undefined;
    });
  };
}

if (!CacheStorage.prototype.match) {
  // This is probably vulnerable to race conditions (removing caches etc)
  CacheStorage.prototype.match = function match(request, opts) {
    var caches = this;

    return this.keys().then(function (cacheNames) {
      var match;

      return cacheNames.reduce(function (chain, cacheName) {
        return chain.then(function () {
          return match || caches.open(cacheName).then(function (cache) {
            return cache.match(request, opts);
          }).then(function (response) {
            match = response;
            return match;
          });
        });
      }, Promise.resolve());
    });
  };
}

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

var getUrl = function getUrl(href) {
  var url = new URL(href, self.location);
  url.hash = '';
  return url;
};
var isCorsRequest = function isCorsRequest(url) {
  return url.search(self.location.origin) === -1;
};

var ServiceWorker = function () {
  function ServiceWorker() {
    classCallCheck(this, ServiceWorker);

    this.router = {
      get: [],
      post: [],
      patch: [],
      put: [],
      delete: []
    };
    this._init();
  }

  createClass(ServiceWorker, [{
    key: '_init',
    value: function _init() {
      this._configure();
      this._install();
      this._activate();
      this._fetch();
    }
  }, {
    key: '_configure',
    value: function _configure() {
      var _this = this;

      Object.keys(this.router).forEach(function (method) {
        _this[method] = function (match, callback) {
          if (typeof match === 'string') {
            match = new RegExp(match);
          } else if (!(match instanceof RegExp)) {
            throw new Error('match is invalid!');
          }
          if (typeof callback !== 'function') {
            throw new Error('callback is invalid!');
          }
          _this.router[method].push({
            match: match,
            callback: callback
          });
        };
      });
    }
  }, {
    key: '_install',
    value: function _install() {
      self.addEventListener('install', function (event) {
        return event.waitUntil(self.skipWaiting());
      });
    }
  }, {
    key: '_activate',
    value: function _activate() {
      self.addEventListener('activate', function (event) {
        return event.waitUntil(self.clients.claim());
      });
    }
  }, {
    key: '_fetch',
    value: function _fetch() {
      var _this2 = this;

      self.addEventListener('fetch', function (event) {
        var router = _this2._getRouter(event);
        if (router) {
          var req = _this2._getRequest(event.request.clone());
          var res = {};
          router.callback(req, res);
          event.respondWith(_this2._getResponse(res));
        }
      });
    }
  }, {
    key: '_getRouter',
    value: function _getRouter(event) {
      var method = event.request.method.toLowerCase();
      var url = getUrl(event.request.url);
      var routers = this.router[method];
      var router = null;
      if (routers && !isCorsRequest(url.origin)) {
        routers.forEach(function (item) {
          if (router === null && item.match.test(url.pathname)) {
            router = item;
          }
        });
      }
      return router;
    }
  }, {
    key: '_getRequest',
    value: function _getRequest(request) {
      var req = request.clone();
      var credentials = req.credentials,
          headers = req.headers,
          integrity = req.integrity,
          method = req.method,
          mode = req.mode,
          redirect = req.redirect,
          referrer = req.referrer,
          referrerPolicy = req.referrerPolicy,
          url = req.url;

      var headersObj = {};
      Array.from(headers.entries()).forEach(function (item) {
        headersObj[item[0]] = item[1];
      });
      return {
        credentials: credentials,
        headers: headersObj,
        integrity: integrity,
        method: method,
        mode: mode,
        redirect: redirect,
        referrer: referrer,
        referrerPolicy: referrerPolicy,
        url: getUrl(url),
        request: request
      };
    }
  }, {
    key: '_getResponse',
    value: function _getResponse(data) {
      var headers = Object.assign({
        'Content-Type': 'application/json',
        'X-Mock-Response': 'yes'
      }, data.headers);
      var res = new Response(JSON.stringify(data.body), {
        headers: headers,
        status: data.status || 200,
        statusText: data.statusText || 'OK'
      });
      return Promise.resolve(res);
    }
  }]);
  return ServiceWorker;
}();

ServiceWorker.defaultOptions = {};

module.exports = ServiceWorker;
