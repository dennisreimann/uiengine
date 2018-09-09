'use strict'
const { join, posix, resolve } = require('path')
const config = require('./config')
const packageConfig = require('../package.json')

exports.assetsPath = function (_path) {
  const { assetsSubDirectory } = process.env.NODE_ENV === 'production'
    ? config.build
    : config.dev
  return posix.join(assetsSubDirectory, _path)
}

exports.createNotifierCallback = () => {
  const notifier = require('node-notifier')

  return (severity, errors) => {
    if (severity !== 'error') return

    const error = errors[0]
    const filename = error.file && error.file.split('!').pop()

    notifier.notify({
      title: packageConfig.name,
      message: severity + ': ' + error.name,
      subtitle: filename || '',
      timeout: 5,
      icon: join(__dirname, 'logo.png')
    })

    notifier.on('click', () => {
      const exec = require('child_process').exec
      exec(`$EDITOR ${resolve(__dirname, '..', filename)}`)
    })
  }
}
