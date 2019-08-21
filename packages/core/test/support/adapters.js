const { join, resolve } = require('path')
const { testProjectPath } = require('../../../../test/support/paths')
const srcPath = resolve(testProjectPath, 'src')

const webpackAdapterReactOptions = require(join(testProjectPath, 'lib/webpack-adapter-react-options'))
const webpackAdapterVueOptions = require(join(testProjectPath, 'lib/webpack-adapter-vue-options'))

const adapters = {
  pug: {
    module: '@uiengine/adapter-pug',
    options: {
      pretty: true,
      basedir: srcPath
    }
  },
  html: {
    module: '@uiengine/adapter-html',
    options: {
      basedir: srcPath
    }
  },
  vue: {
    module: '@uiengine/adapter-webpack',
    options: webpackAdapterVueOptions
  },
  jsx: {
    module: '@uiengine/adapter-webpack',
    options: webpackAdapterReactOptions
  },
  ejs: {
    module: '@uiengine/adapter-ejs',
    options: {}
  },
  hbs: {
    module: '@uiengine/adapter-handlebars',
    options: {}
  },
  marko: {
    module: '@uiengine/adapter-marko',
    options: {}
  }
}

module.exports = {
  adapters
}
