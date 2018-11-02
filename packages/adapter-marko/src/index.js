const {
  FileUtil: { invalidateRequireCache }
} = require('@uiengine/util')

async function setup (options) {
  const install = options.install || {
    compilerOptions: {
      writeToDisk: false
    }
  }

  require('marko/node-require').install(install)
}

async function registerComponentFile (options, filePath) {
  invalidateRequireCache(filePath)
}

async function render (options, filePath, data = {}) {
  return new Promise((resolve, reject) => {
    try {
      invalidateRequireCache(filePath)
      const template = require(filePath)

      template.renderToString(data, (error, rendered) => {
        if (error) {
          reject(error)
        } else {
          resolve(rendered)
        }
      })
    } catch (error) {
      reject(error)
    }
  })
}

function filesForComponent (options, componentName) {
  return [
    {
      basename: `${componentName}.marko`,
      data: `<div class="${componentName}">\n  <!-- TODO: implement -->\n</div>\n`
    }
  ]
}

function filesForVariant (options, componentName, variantName) {
  return [
    {
      basename: `${variantName}.marko`,
      data: `<include('../${componentName}.marko', input)/>\n`
    }
  ]
}

module.exports = {
  setup,
  render,
  registerComponentFile,
  filesForComponent,
  filesForVariant
}
