'use strict'

const { join } = require('path')
const utils = require('./utils')
const config = require('./config')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const vueLoaderConfig = require('./vue-loader.conf')

const resolve = dir => join(__dirname, '..', dir)
const isProduction = process.env.NODE_ENV === 'production'

const createLintingRule = () => ({
  test: /\.(js|vue)$/,
  loader: 'eslint-loader',
  enforce: 'pre',
  include: [resolve('src'), resolve('test')],
  options: {
    formatter: require('eslint-friendly-formatter'),
    emitWarning: true
  }
})

module.exports = {
  context: resolve(''),
  entry: {
    uiengine: resolve('src/vue/main.js'),
    'uiengine-inject': resolve('src/scripts/inject.js'),
    'uiengine-preview': 'iframe-resizer/js/iframeResizer.contentWindow.js'
  },
  output: {
    path: config.build.assetsRoot,
    filename: '[name].js',
    publicPath: '/'
  },
  resolve: {
    extensions: ['.js', '.vue', '.json'],
    alias: {
      'vue$': 'vue/dist/vue.esm.js'
    }
  },
  plugins: [
    // extract css into its own file
    new ExtractTextPlugin({
      filename: utils.assetsPath(`styles/[name]${isProduction ? '.[contenthash:20]' : ''}.css`),
      // Setting the following option to `false` will not extract CSS from codesplit chunks.
      // Their CSS will instead be inserted dynamically with style-loader when the codesplit chunk has been loaded by webpack.
      // It's currently set to `true` because we are seeing that sourcemaps are included in the codesplit bundle as well when it's `false`,
      // increasing file size: https://github.com/vuejs-templates/webpack/issues/1110
      allChunks: true
    }),
    // copy custom static assets
    new CopyWebpackPlugin([
      {
        from: resolve('static'),
        to: config.build.assetsSubDirectory,
        ignore: ['.*']
      }
    ]),
    // https://github.com/ampedandwired/html-webpack-plugin
    new HtmlWebpackPlugin({
      filename: resolve('lib/templates/index.ejs'),
      template: resolve('src/templates/index.ejs'),
      excludeChunks: ['uiengine-inject'],
      inject: false,
      window: {
        locales: {
          de: require(resolve('src/locales/de.json')),
          en: require(resolve('src/locales/en.json'))
        }
      },
      chunksSortMode: 'dependency'
    }),
    new HtmlWebpackPlugin({
      filename: resolve('lib/templates/sketch.ejs'),
      template: resolve('src/templates/sketch.ejs'),
      excludeChunks: ['uiengine'],
      inject: false
    })
  ],
  module: {
    rules: [
      ...(config.dev.useEslint ? [createLintingRule()] : []),
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: vueLoaderConfig
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: [resolve('src'), resolve('test')]
      },
      {
        test: /\.ejs$/,
        loader: 'ejs-compiled-loader?compileDebug'
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('img/[name].[hash:7].[ext]')
        }
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('media/[name].[hash:7].[ext]')
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
        }
      }
    ]
  },
  node: {
    // prevent webpack from injecting useless setImmediate polyfill because Vue
    // source contains it (although only uses it if it's native).
    setImmediate: false,
    // prevent webpack from injecting mocks to Node native modules
    // that does not make sense for the client
    dgram: 'empty',
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
    child_process: 'empty'
  }
}
