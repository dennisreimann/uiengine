'use strict'

const { dirname, join } = require('path')
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')
const OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin')
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')

const isProduction = process.env.NODE_ENV === 'production'
const highlightjsStyles = dirname(require.resolve('highlight.js/styles/github.css'))
const resolve = dir => join(__dirname, dir)
const assetsPath = '_assets'
const publicPath = filePath => `${assetsPath}/${filePath}`
const assetPath = filePath => `<%= basePath %>${filePath}`
const fileNameTmpl = `[name]${isProduction ? '.[contenthash:7]' : ''}`
const plugins = [
  new VueLoaderPlugin(),
  // extract css into its own file
  new MiniCssExtractPlugin({
    filename: publicPath(`styles/${fileNameTmpl}.css`)
  }),
  // copy custom static assets
  new CopyWebpackPlugin([
    {
      from: highlightjsStyles,
      to: publicPath('styles/hljs'),
      ignore: ['.*']
    }
  ]),
  // https://github.com/ampedandwired/html-webpack-plugin
  new HtmlWebpackPlugin({
    filename: resolve('lib/templates/index.ejs'),
    template: resolve('src/templates/index.ejs'),
    excludeChunks: ['inject'],
    inject: false,
    locales: require('./src/locales'),
    assetPath
  }),
  new HtmlWebpackPlugin({
    filename: resolve('lib/templates/sketch.ejs'),
    template: resolve('src/templates/sketch.ejs'),
    excludeChunks: ['main'],
    inject: false,
    assetPath
  }),
  new HtmlWebpackPlugin({
    filename: resolve('lib/templates/tokens.ejs'),
    template: resolve('src/templates/tokens.ejs'),
    excludeChunks: ['main'],
    inject: false,
    assetPath
  })
]

if (isProduction) {
  // const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')
  // plugins.push(
  //   new BundleAnalyzerPlugin()
  // )
} else {
  plugins.push(
    new FriendlyErrorsPlugin({
      onErrors: () => {
        const notifier = require('node-notifier')

        return (severity, errors) => {
          if (severity !== 'error') return

          const error = errors[0]
          const filename = error.file && error.file.split('!').pop()

          notifier.notify({
            title: 'UIengine UI',
            message: `${severity}: ${error.name}`,
            subtitle: filename || '',
            timeout: 5
          })

          notifier.on('click', () => {
            const exec = require('child_process').exec
            exec(`$EDITOR ${resolve(filename)}`)
          })
        }
      }
    })
  )
}

module.exports = {
  mode: isProduction ? 'production' : 'development',
  bail: isProduction,
  context: __dirname,
  entry: {
    main: resolve('src/vue/main.js'),
    inject: resolve('src/styles/entry/inject.styl'),
    preview: 'iframe-resizer/js/iframeResizer.contentWindow.js'
  },
  output: {
    path: resolve('dist'),
    filename: publicPath(`scripts/${fileNameTmpl}.js`),
    publicPath: '/'
  },
  resolve: {
    extensions: ['.js', '.vue', '.json'],
    alias: {
      'vue$': 'vue/dist/vue.esm.js'
    }
  },
  optimization: {
    runtimeChunk: 'single',
    noEmitOnErrors: true,
    minimizer: [
      new TerserPlugin({
        extractComments: true,
        cache: true,
        parallel: true,
        sourceMap: true
      }),
      new OptimizeCSSPlugin({})
    ]
  },
  plugins,
  module: {
    rules: [
      {
        test: /\.(js|vue)$/,
        loader: 'eslint-loader',
        enforce: 'pre',
        include: [resolve('src'), resolve('test')],
        options: {
          formatter: require('eslint-friendly-formatter'),
          emitWarning: true
        }
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: [resolve('src'), resolve('test')],
        // we keep the babel options in this webpack config because the babelrc
        // needs to be configured with the node compile options. this makes this
        // file more complex, because we also need to configure the vue-loader
        // separately, see https://github.com/vuejs/vue-loader/issues/350
        options: {
          presets: ['@babel/preset-env'],
          plugins: [
            '@babel/plugin-proposal-object-rest-spread',
            '@babel/plugin-syntax-dynamic-import'
          ]
        }
      },
      {
        test: /\.(styl|stylus)$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader
          },
          {
            loader: 'css-loader',
            options: {
              sourceMap: true
            }
          },
          {
            loader: 'postcss-loader',
            options: {
              sourceMap: true
            }
          },
          {
            loader: 'stylus-loader',
            options: {
              sourceMap: true,
              paths: [resolve('src/styles')],
              import: ['lib/mediaQueries', 'lib/mixins'],
              url: { name: 'embedurl' }
            }
          }
        ]
      },
      {
        test: /\.ejs$/,
        loader: 'compile-ejs-loader'
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: publicPath('img/[name].[hash:7].[ext]')
        }
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: publicPath('media/[name].[hash:7].[ext]')
        }
      },
      {
        test: /\.woff2?$/,
        loader: 'file-loader',
        options: {
          limit: 10000,
          // useRelativePath: true did not work, hence the dance
          // name: publicPath('fonts/[name].[hash:7].[ext]'),
          name: 'fonts/[name].[hash:7].[ext]',
          outputPath: assetsPath,
          publicPath: '..'
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
