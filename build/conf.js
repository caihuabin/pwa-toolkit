const resolve = require('rollup-plugin-node-resolve')
const babel = require('rollup-plugin-babel')

module.exports = {
  entry: 'src/index.js',
  plugins: [
    resolve(),
    babel({
      exclude: 'node_modules/**',
      presets: [
        ['es2015', { modules: false }],
      ],
      plugins: [
        'external-helpers',
        'transform-object-rest-spread'
      ],
      babelrc: false
    })
  ],
  dest: './lib/index.js',
  format: 'es'
}
