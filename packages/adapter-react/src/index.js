const ReactDOMServer = require('react-dom/server')

require('babel-register')({})

// invalidate require cache so we get template updates as well
const invalidateModuleCache = filePath => delete require.cache[require.resolve(filePath)]

export async function registerComponentFile (options, filePath) {
  invalidateModuleCache(filePath)
}

export async function render (options, filePath, data = {}) {
  invalidateModuleCache(filePath)

  try {
    let template = require(filePath)
    if (template.default) template = template.default
    const vdom = template(data)

    return ReactDOMServer.renderToString(vdom)
  } catch (err) {
    const message = [`React DOM could not render "${filePath}"!`, err]

    if (options.debug) message.push(JSON.stringify(data, null, 2))

    throw new Error(message.join('\n\n'))
  }
}
