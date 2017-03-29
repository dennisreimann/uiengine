const R = require('ramda')
const fs = require('fs')
const path = require('path')
const assert = require('assert')
const yaml = require('js-yaml')
const chalk = require('chalk')
const parsing = require('./parsing')
const Markdown = require('./markdown')

const renderMarkdown = Markdown.parseString

const fromExternalFile = (filePath) => {
  const isYAML = filePath.match(/\.ya?ml$/)
  const isJS = filePath.match(/\.js(on)?$/)
  const isMarkdown = filePath.match(/\.(md|markdown)?$/)

  if (isYAML) {
    const string = fs.readFileSync(filePath, 'utf-8')
    return parseString(string, filePath)
  } else if (isMarkdown) {
    const string = fs.readFileSync(filePath, 'utf-8')
    return renderMarkdown(string)
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
      const filePath = path.join(data, dataPath)

      return fromExternalFile(filePath)
    }
  })

const includeYamlType = (embeddingFilePath, sourcePaths) =>
  new yaml.Type('!include', {
    kind: 'scalar',

    construct (includePath) {
      let basedir
      if (path.isAbsolute(includePath)) {
        basedir = sourcePaths && sourcePaths.base || process.cwd()
      } else {
        basedir = path.dirname(path.resolve(embeddingFilePath))
      }
      assert(basedir, `YAML Include Schema requires an absolute path (root is ${basedir})`)
      const filePath = path.join(basedir, includePath)
      return fromExternalFile(filePath)
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

    return yaml.safeLoad(string.trim(), { schema, filename })
  } catch (err) {
    throw new Error(chalk.red(`Could not parse YAML: ${err}`) + '\n\n' + chalk.gray(string))
  }
}

module.exports = {
  parseString,
  fromFileSync: R.partial(parsing.fromFileSync, [parseString]),
  fromFile: R.partial(parsing.fromFile, [parseString]),
  fromString: R.partial(parsing.fromString, [parseString])
}
