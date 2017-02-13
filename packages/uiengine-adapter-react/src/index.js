const ReactDOMServer = require('react-dom/server')

require('babel-register')({})

// invalidate require cache so we get template updates as well
const invalidateModuleCache = (filePath) => delete require.cache[require.resolve(filePath)]

async function registerComponentFile (options, filePath) {
  return new Promise((resolve, reject) => {
    invalidateModuleCache(filePath)
    resolve()
  })
}

async function render (options, filePath, data = {}) {
  return new Promise((resolve, reject) => {
    invalidateModuleCache(filePath)

    try {
      const template = require(filePath).default
      const vdom = template(data)
      const rendered = ReactDOMServer.renderToString(vdom)

      resolve(rendered)
    } catch (err) {
      reject([
        `React DOM could not render "${filePath}"!`,
        err.stack,
        JSON.stringify(data, null, '  ')
      ].join('\n\n'))
    }
  })
}

module.exports = {
  registerComponentFile,
  render
}
