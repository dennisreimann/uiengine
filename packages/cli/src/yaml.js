const R = require('ramda')
const { readFileSync } = require('fs')
const { dirname, isAbsolute, join, resolve } = require('path')
const assert = require('assert')
const yaml = require('js-yaml')
const parsing = require('@uiengine/util/src/parsing')
const Markdown = require('@uiengine/util/src/markdown')
const { invalidateRequireCache } = require('@uiengine/util/src/file')
const { markSample } = require('@uiengine/util/src/message')
const { UiengineInputError } = require('@uiengine/util/src/error')

const renderMarkdown = Markdown.parseString

const fromExternalFile = (embeddingFilePath, sourcePaths, filePath) => {
  const isYAML = filePath.match(/\.ya?ml$/)
  const isJS = filePath.match(/\.js(on)?$/)
  const isMarkdown = filePath.match(/\.(md|markdown)?$/)

  if (isYAML) {
    const string = readFileSync(filePath, 'utf8')
    return parseString(string, filePath, sourcePaths)
  } else if (isMarkdown) {
    const string = readFileSync(filePath, 'utf8')
    return renderMarkdown(string, filePath, sourcePaths)
  } else if (isJS) {
    // invalidate require cache so that changes are reflected
    invalidateRequireCache(filePath)
    return require(filePath)
  } else {
    return filePath
  }
}

const dataYamlType = (embeddingFilePath, sourcePaths) =>
  new yaml.Type('!data', {
    kind: 'scalar',

    construct (dataPath) {
      const { data } = sourcePaths
      assert(isAbsolute(data), `YAML Data Schema requires an absolute path (root is ${data})`)
      const filePath = isAbsolute(dataPath)
        ? join(data, dataPath)
        : resolve(dirname(embeddingFilePath), dataPath)

      return fromExternalFile(embeddingFilePath, sourcePaths, filePath)
    }
  })

const includeYamlType = (embeddingFilePath, sourcePaths) =>
  new yaml.Type('!include', {
    kind: 'scalar',

    construct (includePath) {
      let basedir
      if (isAbsolute(includePath)) {
        basedir = sourcePaths.base
      } else {
        basedir = dirname(resolve(embeddingFilePath))
      }
      assert(basedir, `YAML Include Schema requires an absolute path (root is ${basedir})`)
      const filePath = join(basedir, includePath)
      return fromExternalFile(embeddingFilePath, sourcePaths, filePath)
    }
  })

const MarkdownYamlType = new yaml.Type('!markdown', {
  kind: 'scalar',

  resolve (data) {
    return typeof data === 'string'
  },

  construct (string) {
    return renderMarkdown(string)
  }
})

const parseString = (string, filename, sourcePaths) => {
  try {
    const IncludeYamlType = includeYamlType(filename, sourcePaths)
    const DataYamlType = dataYamlType(filename, sourcePaths)
    const schema = yaml.Schema.create([IncludeYamlType, DataYamlType, MarkdownYamlType])
    const json = true // duplicate keys in a mapping will override values rather than throwing an error

    return yaml.safeLoad(string.trim(), { schema, filename, json })
  } catch (err) {
    throw new UiengineInputError(['Could not parse YAML!', markSample(string)], err)
  }
}

const fromFileSync = R.partial(parsing.fromFileSync, [parseString])
const fromFile = R.partial(parsing.fromFile, [parseString])
const fromString = R.partial(parsing.fromString, [parseString])

module.exports = {
  parseString,
  fromFileSync,
  fromFile,
  fromString
}
