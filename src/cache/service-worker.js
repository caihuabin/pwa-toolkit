import '../serviceworker-cache-polyfill'

const getUrl = (href) => {
  const url = new URL(href, self.location)
  url.hash = ''
  return url.toString()
}
const dealAssets = assets => assets.map(href => /^https?:\/\//i.test(href) ? href : getUrl(href))
const isCORSRequest = url => url.search(self.location.host) === -1

class ServiceWorker {
  constructor(options) {
    this.options = Object.assign({}, ServiceWorker.defaultOptions, options)
    this.cacheName = String(this.options.cacheName)
    this.cacheAssets = dealAssets(this.options.assets)
    this.cacheAssetsSet = new Set(this.cacheAssets)
    this.errorAssetsSet = new Set()
    this._init()
  }

  _init() {
    this._install()
    this._activate()
    this._fetch()
    this._message()
  }

  _install() {
    // fetch 设置 mode 请求并缓存，直接使用 cache.addAll 可能会出现跨域问题
    self.addEventListener('install', event => event.waitUntil(
      caches.open(this.cacheName)
      .then(cache => Promise.all(this._cacheRequests(cache)))
      .then(() => this.options.skipWaiting && self.skipWaiting()) // 默认进入 waiting ，可以跳过直接进入更新
    ))
  }
  _activate() {
    // 清除不需要的缓存
    self.addEventListener('activate', event => event.waitUntil(
      caches.open(this.cacheName)
      .then(cache => cache.keys().then(existingRequests =>
        Promise.all(existingRequests.map((request) => {
          if (!this.cacheAssetsSet.has(request.url)) {
            cache.delete(request)
          }
        }))
      ))
      .then(() => self.clients.claim()) // 更新完成通知所有注册页面
    ))
  }
  _fetch() {
    // 可以使用离线默认内容
    const offlineRequest = fetchRequest => Promise.resolve('离线默认内容')

    // 资源请求成功后，加入缓存
    const onlineRequest = fetchRequest => fetch(fetchRequest).then((response) => {
      if (!response || !response.ok) {
        throw new Error(fetchRequest.url + '：请求失败，状态码' + response.status)
      }
      caches.open(this.cacheName).then(cache => cache.put(getUrl(fetchRequest.url), response))
      return response.clone()
    })
    .catch(() => offlineRequest(fetchRequest)) // 获取失败，离线资源降级替换

    self.addEventListener('fetch', (event) => {
      if ('GET' === event.request.method) {
        const url = getUrl(event.request.url)
        if (this.cacheAssetsSet.has(url) && !this.errorAssetsSet.has(url)) {
          event.respondWith(
            caches.open(this.cacheName)
            .then(cache => cache.match(url)
              .then((res) => {
                if (res) return res.clone()
                throw Error('数据缓存丢失，将会重新获取数据')
              })
            ).catch((err) => {
              const fetchRequest = event.request.clone()
              if (navigator.onLine) {
                // 如果为联网状态
                return onlineRequest(fetchRequest)
              } else {
                // 如果为离线状态
                return offlineRequest(fetchRequest)
              }
            })
          )
        }
      }
    })
  }
  _message() {
    self.addEventListener('message', (event) => {
      const data = event.data
      if (!data) return

      switch (data.action) {
        case 'skipWaiting':
          {
            if (self.skipWaiting) self.skipWaiting()
          }
          break
      }
    })
  }
  _cacheRequests(cache) {
    const assets = Array.from(this.cacheAssetsSet)
    return assets.map((url) => {
      // 设置 no-cors 时， response 只能使用 body，状态信息为空
      // 设置 cors 则需要服务端设置 access 响应头
      const request = isCORSRequest(url) ? new Request(url, {
        credentials: 'include',
        mode: 'no-cors'
      }) : new Request(url, {
        credentials: 'include'
      })
      return fetch(request).then((response) => {
        if (!response.ok && request.mode !== 'no-cors') {
          throw new Error(url + '：请求失败，状态码' + response.status)
        }
        return cache.put(url, response)
      }).catch((err) => {
        // 将失败的 url 移入 errorAssetsSet
        console.warn(err, '预先缓存失败 url:' + url)
        this.errorAssetsSet.add(url)
      })
    })
  }
}

ServiceWorker.defaultOptions = {
  cacheName: 'cache-name',
  assets: [],
  skipWaiting: false
}

export default ServiceWorker
