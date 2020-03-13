const webpack = require('webpack')
const merge = require('webpack-merge')
const nodeExternals = require('webpack-node-externals')
const PnpWebpackPlugin = require('pnp-webpack-plugin')

const mode = process.env.NODE_ENV || 'development'

const baseConfig = {
  mode,

  // entry and output aren't necessary for the tests,
  // because the adapter overwrites them anyways

  resolve: {
    extensions: ['.js', '.jsx'],
    plugins: [
      PnpWebpackPlugin
    ]
  },

  resolveLoader: {
    plugins: [
      PnpWebpackPlugin.moduleLoader(module)
    ]
  },

  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: require.resolve('babel-loader'),
        options: {
          cacheDirectory: true,
          presets: [
            require.resolve('@babel/preset-env'),
            require.resolve('@babel/preset-react')
          ]
        }
      }
    ]
  },

  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(mode)
    })
  ]
}

const clientConfig = merge(baseConfig, {
  name: 'client'
})

const serverConfig = merge(baseConfig, {
  name: 'server',
  target: 'node',

  // https://webpack.js.org/configuration/externals/#function
  // https://github.com/liady/webpack-node-externals
  // Externalize app dependencies. This makes the server build much faster
  // and generates a smaller bundle file.
  externals: nodeExternals({
    // do not externalize CSS files in case we need to import it from a dep
    whitelist: /\.css$/
  })
})

module.exports = [clientConfig, serverConfig]
