const fs = require('fs')
const path = require('path')
const assert = require('assert')

const resolveFilePath = (options, embeddingFilePath, filePath) => {
  if (path.isAbsolute(filePath)) {
    const { basedir } = options
    assert(basedir, 'Please provide a "basedir" option for the HTML adapter to resolve absolute includes.')

    return path.join(basedir, filePath)
  } else {
    const basedir = path.dirname(embeddingFilePath)
    return path.resolve(basedir, filePath)
  }
}

const renderFile = (options, filePath) => {
  const html = fs.readFileSync(filePath, 'utf-8')

  const rendered = html.replace(/<!--#\s?include file="(.*?)"(.*?)-->/g, (match, includeFile) => {
    const includePath = resolveFilePath(options, filePath, includeFile)

    return renderFile(options, includePath)
  })

  return rendered
}

export async function render (options, filePath, data = {}) {
  return new Promise((resolve, reject) => {
    try {
      const rendered = renderFile(options, filePath)

      resolve(rendered)
    } catch (err) {
      const message = [`HTML could not render "${filePath}"!`, err]

      if (options.debug) message.push(JSON.stringify(data, null, '  '))

      reject(message.join('\n\n'))
    }
  })
}

export function filesForComponent (componentName) {
  return [
    {
      basename: `${componentName}.html`,
      data: `<div class="${componentName}">\n  <!-- TODO: implement -->\n</div>\n`
    }
  ]
}

export function filesForVariant (componentName, variantName) {
  return [
    {
      basename: `${variantName}.html`,
      data: `<!--#include file="../${componentName}.html" -->\n`
    }
  ]
}
