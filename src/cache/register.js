const supportSw = () => {
  const isLocalhost = Boolean(window.location.hostname === 'localhost' ||
    // IPv6
    window.location.hostname === '[::1]' ||
    // IPv4
    window.location.hostname.match(/^127(?:\\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/)
  )
  const hasSw = Boolean('serviceWorker' in navigator)
  return hasSw && (window.location.protocol === 'https:' || isLocalhost)
}

class Register {
  constructor(options) {
    this.options = Object.assign({}, Register.defaultOptions, options)
    this.scriptName = String(this.options.filename)
    supportSw() && this._init()
  }

  _init() {
    this._load()
    this._online()
    this._offline()
  }

  _load() {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register(this.scriptName)
      .then((registration) => {
        console.log('Registered events at scope: ', registration.scope)
        this._handleInstallingOrUpdating(registration)
        registration.onupdatefound = () => this._handleInstallingOrUpdating(registration)
      })
      .catch(function (err) {
        console.error('Error during service worker registration:', err)
        this.options.onError(err)
        return Promise.reject(err)
      })
    })
  }

  _handleInstallingOrUpdating(registration) {
    const sw = registration.installing || registration.waiting
    const onUpdateStateChange = () => {
      switch (sw.state) {
        case 'redundant': {
          this.options.onUpdateFailed()
          sw.onstatechange = null
        }
        break
        case 'installing': {
          this.options.onUpdating()
        }
        break
        case 'installed': {
          this.options.onUpdateReady()
        }
        break
        case 'activated': {
          this.options.onUpdated()
          sw.onstatechange = null
        }
        break
      }
    }
    const onInstallStateChange = () => {
      switch (sw.state) {
        case 'redundant': {
          this.options.onInstallFailed()
          sw.onstatechange = null
        }
        break
        case 'installing': {
          // Installing, ignore
        }
        break
        case 'installed': {
          // Installed, wait activation
        }
        break
        case 'activated': {
          this.options.onInstalled()
          sw.onstatechange = null
        }
        break
      }
    }

    // No SW or already handled
    if (!sw || sw.onstatechange) return

    let stateChangeHandler
    if (registration.active) {
      onUpdateStateChange()
      stateChangeHandler = onUpdateStateChange
    } else {
      onInstallStateChange()
      stateChangeHandler = onInstallStateChange
    }
    sw.onstatechange = stateChangeHandler
  }

  _online() {
    window.addEventListener('online', () => this.options.online())
  }

  _offline() {
    window.addEventListener('offline', () => this.options.offline())
  }

}

Register.defaultOptions = {
  filename: '',
  onError: () => {},
  onInstalled: () => console.log('serviceWorker:安装成功'),
  onInstallFailed: () => console.log('serviceWorker:安装失败'),
  onUpdating: () => console.log('serviceWorker:更新中...'),
  onUpdateReady: () => {
    window.confirm('serviceWorker:更新完成，有新的资源可用，是否启用？') && Register.skipWaiting()
  },
  onUpdated: () => window.location.reload(),
  onUpdateFailed: () => console.log('serviceWorker:更新失败'),
  online: () => {},
  offline: () => {}
}

Register.skipWaiting = (errback, callback) => {
  navigator.serviceWorker.getRegistration().then((registration) => {
    if (!registration || !registration.waiting) {
      errback && errback()
      return
    }
    registration.waiting.postMessage({
      action: 'skipWaiting'
    })
    callback && callback()
  })
}

Register.update = () => {
  navigator.serviceWorker.getRegistration().then(registration => registration && registration.update())
}

export default Register
