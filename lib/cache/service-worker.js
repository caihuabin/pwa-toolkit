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
  return url.toString();
};
var dealAssets = function dealAssets(assets) {
  return assets.map(function (href) {
    return (/^https?:\/\//i.test(href) ? href : getUrl(href)
    );
  });
};
var isCORSRequest = function isCORSRequest(url) {
  return url.search(self.location.host) === -1;
};

var ServiceWorker = function () {
  function ServiceWorker(options) {
    classCallCheck(this, ServiceWorker);

    this.options = Object.assign({}, ServiceWorker.defaultOptions, options);
    this.cacheName = String(this.options.cacheName);
    this.cacheAssets = dealAssets(this.options.assets);
    this.cacheAssetsSet = new Set(this.cacheAssets);
    this.errorAssetsSet = new Set();
    this._init();
  }

  createClass(ServiceWorker, [{
    key: '_init',
    value: function _init() {
      this._install();
      this._activate();
      this._fetch();
      this._message();
    }
  }, {
    key: '_install',
    value: function _install() {
      var _this = this;

      // fetch 设置 mode 请求并缓存，直接使用 cache.addAll 可能会出现跨域问题
      self.addEventListener('install', function (event) {
        return event.waitUntil(caches.open(_this.cacheName).then(function (cache) {
          return Promise.all(_this._cacheRequests(cache));
        }).then(function () {
          return _this.options.skipWaiting && self.skipWaiting();
        }) // 默认进入 waiting ，可以跳过直接进入更新
        );
      });
    }
  }, {
    key: '_activate',
    value: function _activate() {
      var _this2 = this;

      // 清除不需要的缓存
      self.addEventListener('activate', function (event) {
        return event.waitUntil(caches.open(_this2.cacheName).then(function (cache) {
          return cache.keys().then(function (existingRequests) {
            return Promise.all(existingRequests.map(function (request) {
              if (!_this2.cacheAssetsSet.has(request.url)) {
                cache.delete(request);
              }
            }));
          });
        }).then(function () {
          return self.clients.claim();
        }) // 更新完成通知所有注册页面
        );
      });
    }
  }, {
    key: '_fetch',
    value: function _fetch() {
      var _this3 = this;

      // 可以使用离线默认内容
      var offlineRequest = function offlineRequest(fetchRequest) {
        return Promise.resolve('离线默认内容');
      };

      // 资源请求成功后，加入缓存
      var onlineRequest = function onlineRequest(fetchRequest) {
        return fetch(fetchRequest).then(function (response) {
          if (!response || !response.ok) {
            throw new Error(fetchRequest.url + '：请求失败，状态码' + response.status);
          }
          caches.open(_this3.cacheName).then(function (cache) {
            return cache.put(getUrl(fetchRequest.url), response);
          });
          return response.clone();
        }).catch(function () {
          return offlineRequest(fetchRequest);
        });
      }; // 获取失败，离线资源降级替换

      self.addEventListener('fetch', function (event) {
        if ('GET' === event.request.method) {
          var url = getUrl(event.request.url);
          if (_this3.cacheAssetsSet.has(url) && !_this3.errorAssetsSet.has(url)) {
            event.respondWith(caches.open(_this3.cacheName).then(function (cache) {
              return cache.match(url).then(function (res) {
                if (res) return res.clone();
                throw Error('数据缓存丢失，将会重新获取数据');
              });
            }).catch(function (err) {
              var fetchRequest = event.request.clone();
              if (navigator.onLine) {
                // 如果为联网状态
                return onlineRequest(fetchRequest);
              } else {
                // 如果为离线状态
                return offlineRequest(fetchRequest);
              }
            }));
          }
        }
      });
    }
  }, {
    key: '_message',
    value: function _message() {
      self.addEventListener('message', function (event) {
        var data = event.data;
        if (!data) return;

        switch (data.action) {
          case 'skipWaiting':
            {
              if (self.skipWaiting) self.skipWaiting();
            }
            break;
        }
      });
    }
  }, {
    key: '_cacheRequests',
    value: function _cacheRequests(cache) {
      var _this4 = this;

      var assets = Array.from(this.cacheAssetsSet);
      return assets.map(function (url) {
        // 设置 no-cors 时， response 只能使用 body，状态信息为空
        // 设置 cors 则需要服务端设置 access 响应头
        var request = isCORSRequest(url) ? new Request(url, {
          credentials: 'include',
          mode: 'no-cors'
        }) : new Request(url, {
          credentials: 'include'
        });
        return fetch(request).then(function (response) {
          if (!response.ok && request.mode !== 'no-cors') {
            throw new Error(url + '：请求失败，状态码' + response.status);
          }
          return cache.put(url, response);
        }).catch(function (err) {
          // 将失败的 url 移入 errorAssetsSet
          console.warn(err, '预先缓存失败 url:' + url);
          _this4.errorAssetsSet.add(url);
        });
      });
    }
  }]);
  return ServiceWorker;
}();

ServiceWorker.defaultOptions = {
  cacheName: 'cache-name',
  assets: [],
  skipWaiting: false
};

module.exports = ServiceWorker;
