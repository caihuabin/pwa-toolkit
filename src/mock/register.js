const supportSw = () => {
  const isLocalhost = Boolean(window.location.hostname === 'localhost' ||
    // IPv6
    window.location.hostname === '[::1]' ||
    // IPv4
    window.location.hostname.match(/^127(?:\\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/)
  );
  const hasSw = Boolean('serviceWorker' in navigator)
  return hasSw && (window.location.protocol === 'https:' || isLocalhost)
}

class Register {
  constructor(options) {
    this.options = Object.assign({}, Register.defaultOptions, options)
    this.scriptName = String(this.options.filename)
    if (supportSw()) {
      this.init()
    } else {
      console.warn('Browser does not support serviceWorker.Please use Chrome or FireFox.')
    }
  }

  init() {
    navigator.serviceWorker.register(this.scriptName)
    .then((registration) => {
      console.log('Registered events at scope: ', registration.scope)
    })
    .catch(function (err) {
      console.error('Error during service worker registration:', err)
      return Promise.reject(err)
    })
  }

}

Register.defaultOptions = {
  filename: ''
}

export default Register
