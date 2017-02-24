module.exports = {
  entry: {
    uiengine: './src/scripts/main.js'
  },

  output: {
    filename: 'uiengine.js',
    path: './static/_uiengine-theme/scripts'
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        loader: 'babel-loader',
        options: {
          presets: ['es2015']
        }
      }
    ]
  }
}
