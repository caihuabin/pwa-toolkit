const { rollup } = require('rollup')
const rollupConf = require('./conf')

function build(entry, dest) {
  const config = Object.assign({}, rollupConf, { entry, dest })
  rollup(config).then(bundle => {
    bundle.write({
      format: 'cjs',
      dest
    })
  }).catch(err => console.log(err))
}

build('./src/cache/register.js', './lib/cache/register.js')
build('./src/cache/service-worker.js', './lib/cache/service-worker.js')

build('./src/mock/register.js', './lib/mock/register.js')
build('./src/mock/service-worker.js', './lib/mock/service-worker.js')
