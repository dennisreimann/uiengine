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
  vue: {
    module: '@uiengine/adapter-webpack',
    options: {}
  },
  js: {
    module: '@uiengine/adapter-vue',
    options: {}
  },
  jsx: {
    module: '@uiengine/adapter-react',
    options: {
      babel: {
        presets: [
          '@babel/preset-env',
          '@babel/preset-react'
        ]
      }
    }
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
