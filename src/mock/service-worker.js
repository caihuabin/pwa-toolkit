import '../serviceworker-cache-polyfill'

const getUrl = (href) => {
  const url = new URL(href, self.location)
  url.hash = ''
  return url
}
const isCorsRequest = url => url.search(self.location.origin) === -1

class ServiceWorker {
  constructor() {
    this.router = {
      get: [],
      post: [],
      patch: [],
      put: [],
      delete: []
    }
    this._init()
  }

  _init() {
    this._configure()
    this._install()
    this._activate()
    this._fetch()
  }

  _configure() {
    Object.keys(this.router).forEach(method => {
      this[method] = (match, callback) => {
        if (typeof match === 'string') {
          match = new RegExp(match)
        } else if (!(match instanceof RegExp)) {
          throw new Error('match is invalid!')
        }
        if (typeof callback !== 'function') {
          throw new Error('callback is invalid!')
        }
        this.router[method].push({
          match,
          callback
        })
      }
    })
  }

  _install() {
    self.addEventListener('install', event => event.waitUntil(self.skipWaiting()))
  }

  _activate() {
    self.addEventListener('activate', event => event.waitUntil(self.clients.claim()))
  }

  _fetch() {
    self.addEventListener('fetch', (event) => {
      const router = this._getRouter(event)
      if (router) {
        const req = this._getRequest(event.request.clone())
        const res = {}
        router.callback(req, res)
        event.respondWith(this._getResponse(res))
      }
    })
  }

  _getRouter(event) {
    const method = event.request.method.toLowerCase()
    const url = getUrl(event.request.url)
    const routers = this.router[method]
    let router = null
    if (routers && !isCorsRequest(url.origin)) {
      routers.forEach((item) => {
        if (router === null && item.match.test(url.pathname)) {
          router = item
        }
      })
    }
    return router
  }

  _getRequest(request) {
    const req = request.clone()
    const {
      credentials,
      headers,
      integrity,
      method,
      mode,
      redirect,
      referrer,
      referrerPolicy,
      url
    } = req
    const headersObj = {}
    Array.from(headers.entries()).forEach(item => {
      headersObj[item[0]] = item[1]
    })
    return {
      credentials,
      headers: headersObj,
      integrity,
      method,
      mode,
      redirect,
      referrer,
      referrerPolicy,
      url: getUrl(url),
      request
    }
  }

  _getResponse(data) {
    const headers = Object.assign({
      'Content-Type': 'application/json',
      'X-Mock-Response': 'yes'
    }, data.headers)
    const res = new Response(JSON.stringify(data.body), {
      headers,
      status: data.status || 200,
      statusText: data.statusText || 'OK'
    })
    return Promise.resolve(res)
  }
}

ServiceWorker.defaultOptions = {}

export default ServiceWorker
