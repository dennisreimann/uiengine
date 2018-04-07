'use strict'

const webpack = require('webpack')
const merge = require('webpack-merge')
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')
const utils = require('./utils')
const config = require('./config')
const baseWebpackConfig = require('./webpack.base.conf')

module.exports = merge(baseWebpackConfig, {
  module: {
    rules: utils.styleLoaders({
      sourceMap: config.dev.cssSourceMap,
      extract: true,
      usePostCSS: true
    })
  },
  devtool: config.dev.devtool,
  output: {
    path: config.build.assetsRoot,
    filename: utils.assetsPath('scripts/[name].js')
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"development"'
      }
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin(), // HMR shows correct file names in console on update.
    new webpack.NoEmitOnErrorsPlugin(),
    new FriendlyErrorsPlugin({
      onErrors: config.dev.notifyOnErrors
        ? utils.createNotifierCallback()
        : undefined
    })
  ]
})
