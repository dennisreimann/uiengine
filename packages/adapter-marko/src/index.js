require('marko/node-require').install({
  compilerOptions: {
    writeToDisk: false
  }
})

// invalidate require cache so we get template updates as well
const invalidateModuleCache = (filePath) =>
  delete require.cache[require.resolve(filePath)]

export async function registerComponentFile (options, filePath) {
  return new Promise((resolve, reject) => {
    invalidateModuleCache(filePath)
    resolve()
  })
}

export async function render (options, filePath, data = {}) {
  return new Promise((resolve, reject) => {
    invalidateModuleCache(filePath)

    const template = require(filePath)

    template.renderToString(data, (err, rendered) => {
      if (err) {
        const message = [`Marko could not render "${filePath}"!`, err]

        if (options.debug) message.push(JSON.stringify(data, null, 2))

        reject(message.join('\n\n'))
      } else {
        resolve(rendered)
      }
    })
  })
}

export function filesForComponent (componentName) {
  return [
    {
      basename: `${componentName}.marko`,
      data: `<div class="${componentName}">\n  <!-- TODO: implement -->\n</div>\n`
    }
  ]
}

export function filesForVariant (componentName, variantName) {
  return [
    {
      basename: `${variantName}.marko`,
      data: `<include('../${componentName}.marko', input)/>\n`
    }
  ]
}
