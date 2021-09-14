const { dirname, isAbsolute, join, resolve } = require('path')
const assert = require('assert')
const { FileUtil: { read } }  = require('@uiengine/util')

const INCLUDE_REGEXP = /<!--#\s?include file="(.*?)".*?-->/
const INCLUDES_REGEXP = new RegExp(INCLUDE_REGEXP, 'g')

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

const renderFile = async (options, filePath, data) => {
  const template = await read(filePath)
  let html = renderString(template, data)
  const matches = html.match(INCLUDES_REGEXP)
  if (!matches) return html

  await Promise.all(matches.map(async include => {
    const [, includeFile] = include.match(INCLUDE_REGEXP)
    const includePath = resolveFilePath(options, filePath, includeFile)
    const contents = await renderFile(options, includePath, data)
    html = html.replace(include, contents)
  }))

  return html
}

async function render (options, filePath, data = {}) {
  const result = await renderFile(options, filePath, data)

  return result
}

module.exports = {
  render
}
