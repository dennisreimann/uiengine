const R = require('ramda')
const fs = require('fs')
const path = require('path')
const assert = require('assert')
const yaml = require('js-yaml')
const deepExtend = require('deep-extend')
const parsing = require('./parsing')
const Markdown = require('./markdown')
const { error } = require('./message')

const renderMarkdown = Markdown.parseString

const fromExternalFile = (embeddingFilePath, sourcePaths, filePath) => {
  const isYAML = filePath.match(/\.ya?ml$/)
  const isJS = filePath.match(/\.js(on)?$/)
  const isMarkdown = filePath.match(/\.(md|markdown)?$/)

  if (isYAML) {
    const string = fs.readFileSync(filePath, 'utf-8')
    return parseString(string, filePath, sourcePaths)
  } else if (isMarkdown) {
    const string = fs.readFileSync(filePath, 'utf-8')
    return renderMarkdown(string, filePath, sourcePaths)
  } else if (isJS) {
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
      assert(path.isAbsolute(data), `YAML Data Schema requires an absolute path (root is ${data})`)
      const filePath = path.isAbsolute(dataPath)
        ? path.join(data, dataPath)
        : path.resolve(path.dirname(embeddingFilePath), dataPath)

      return fromExternalFile(embeddingFilePath, sourcePaths, filePath)
    }
  })

const includeYamlType = (embeddingFilePath, sourcePaths) =>
  new yaml.Type('!include', {
    kind: 'scalar',

    construct (includePath) {
      let basedir
      if (path.isAbsolute(includePath)) {
        basedir = sourcePaths.base
      } else {
        basedir = path.dirname(path.resolve(embeddingFilePath))
      }
      assert(basedir, `YAML Include Schema requires an absolute path (root is ${basedir})`)
      const filePath = path.join(basedir, includePath)
      return fromExternalFile(embeddingFilePath, sourcePaths, filePath)
    }
  })

const extendYamlType = (embeddingFilePath, sourcePaths) =>
  new yaml.Type('!extend', {
    kind: 'mapping',

    construct (data) {
      const extendable = data._
      assert(extendable, `YAML Extend Schema requires the data structure to be extended defined with the key '_', which is missing: ${data}`)
      delete data._

      const extended = deepExtend(extendable, data)

      return extended
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
    const ExtendYamlType = extendYamlType(filename, sourcePaths)
    const DataYamlType = dataYamlType(filename, sourcePaths)
    const schema = yaml.Schema.create([IncludeYamlType, ExtendYamlType, DataYamlType, MarkdownYamlType])
    const json = true // duplicate keys in a mapping will override values rather than throwing an error

    return yaml.safeLoad(string.trim(), { schema, filename, json })
  } catch (err) {
    throw new Error(error(`Could not parse YAML: ${err.stack}`, string))
  }
}

module.exports = {
  parseString,
  fromFileSync: R.partial(parsing.fromFileSync, [parseString]),
  fromFile: R.partial(parsing.fromFile, [parseString]),
  fromString: R.partial(parsing.fromString, [parseString])
}
