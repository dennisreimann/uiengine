const { readFileSync } = require('fs')
const { dirname, isAbsolute, join, resolve } = require('path')
const assert = require('assert')

const resolveFilePath = (options, embeddingFilePath, filePath) => {
  if (isAbsolute(filePath)) {
    const { basedir } = options
    assert(basedir, 'Please provide a "basedir" option for the HTML adapter to resolve absolute includes.')

    return join(basedir, filePath)
  } else {
    const basedir = dirname(embeddingFilePath)
    return resolve(basedir, filePath)
  }
}

const resolveVariable = (data, varPath, varPathComps) => {
  if (!varPathComps) {
    varPathComps = varPath.split('.')
  }

  if (varPathComps.length === 0) {
    return data
  } else if (varPathComps.length === 1) {
    const value = data[varPathComps[0]]
    return value || `\${${varPath}}`
  } else {
    const prop = varPathComps.shift()
    if (data[prop] === undefined) data[prop] = {}
    return resolveVariable(data[prop], varPath, varPathComps)
  }
}

const renderString = (str, data) =>
  str.replace(/\$\{(.+?)\}/g, (match, varPath) => resolveVariable(data, varPath))

const renderFile = (options, filePath, data) => {
  const template = readFileSync(filePath, 'utf-8')
  const html = renderString(template, data)

  const rendered = html.replace(/<!--#\s?include file="(.*?)"(.*?)-->/g, (match, includeFile) => {
    const includePath = resolveFilePath(options, filePath, includeFile)

    return renderFile(options, includePath, data)
  })

  return rendered
}

export async function render (options, filePath, data = {}) {
  return new Promise((resolve, reject) => {
    try {
      const rendered = renderFile(options, filePath, data)

      resolve(rendered)
    } catch (err) {
      const message = [`HTML could not render "${filePath}"!`, err]

      if (options.debug) message.push(JSON.stringify(data, null, 2))

      reject(message.join('\n\n'))
    }
  })
}
