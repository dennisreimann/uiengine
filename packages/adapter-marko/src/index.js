const {
  FileUtil: { invalidateRequireCache }
} = require('@uiengine/util')

const handleError = (options, err, reject, filePath, data) => {
  const message = [`Marko could not render "${filePath}"!`, err]

  if (options.debug) message.push(JSON.stringify(data, null, 2))

  const error = new Error(message.join('\n\n'))
  error.code = err.code
  error.path = filePath

  reject(error)
}

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

      template.renderToString(data, (err, rendered) => {
        if (err) {
          handleError(options, err, reject, filePath, data)
        } else {
          resolve(rendered)
        }
      })
    } catch (err) {
      handleError(options, err, reject, filePath, data)
    }
  })
}

function filesForComponent (componentName) {
  return [
    {
      basename: `${componentName}.marko`,
      data: `<div class="${componentName}">\n  <!-- TODO: implement -->\n</div>\n`
    }
  ]
}

function filesForVariant (componentName, variantName) {
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
