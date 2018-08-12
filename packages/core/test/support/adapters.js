const { resolve } = require('path')
const { testProjectPath } = require('../../../../test/support/paths')
const srcPath = resolve(testProjectPath, 'src')

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
  vhtml: {
    module: '@uiengine/adapter-vue',
    options: {}
  },
  js: {
    module: '@uiengine/adapter-vue',
    options: {}
  },
  jsx: {
    module: '@uiengine/adapter-react',
    options: {}
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
