const { resolve } = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const stats = require('./utils/stats')

const isProduction = process.env.NODE_ENV === 'production'
const demoNames = ['mock', 'cache']

const configs = demoNames.map(demoName => ({
  entry: {
    index: `./src/${demoName}/index.js`,
    'service-worker': `./src/${demoName}/service-worker.js`
  },
  output: {
    filename: '[name].js',
    path: resolve(`./site/${demoName}`),
    publicPath: `/${demoName}`
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: `./src/${demoName}/index.html`,
      true: false,
      excludeChunks: ['service-worker']
    }),
    ...(isProduction ? [
      new webpack.DefinePlugin({
        'process.env': { NODE_ENV: '"production"' }
      }),
      new webpack.optimize.UglifyJsPlugin({
        sourceMap: false,
        compress: { warnings: false }
      }),
      new webpack.LoaderOptionsPlugin({ minimize: true })
    ] : [])
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        options: {
          presets: [
            ['es2015', { modules: false }]
          ]
        },
        exclude: /node_modules/
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        loader: 'url-loader',
        options: {
          limit: 8192,
          name: 'img/[name].[ext]?[hash]'
        }
      },
      {
        test: /\.s?css$/, loader: 'style-loader!css-loader'
      }
    ]
  },
  resolve: {
    extensions: ['.js', '.css'],
    alias: {
      '@lib': resolve('../lib'),
    }
  },
  performance: { hints: false },
  devtool: isProduction ? '#source-map' :'#eval-source-map',
  devServer: {
    disableHostCheck: true,
    host: '0.0.0.0',
    contentBase: resolve('./site'),
    stats
  }
}))

module.exports = configs
