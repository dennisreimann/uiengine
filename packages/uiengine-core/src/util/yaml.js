const R = require('ramda')
const fs = require('fs')
const path = require('path')
const assert = require('assert')
const yaml = require('js-yaml')
const parsing = require('./parsing')
const Markdown = require('./markdown')

const renderMarkdown = Markdown.parseString

const IncludeYamlType = new yaml.Type('!include', {
  kind: 'scalar',

  construct (includePath) {
    const cwd = process.cwd()
    assert(path.isAbsolute(includePath), `YAML Include Schema requires an absolute path (root is ${cwd})`)
    const filePath = path.join(cwd, includePath)

    const isYAML = includePath.match(/\.ya?ml$/)
    const isJS = includePath.match(/\.js(on)?$/)
    const isMarkdown = includePath.match(/\.(md|markdown)?$/)

    if (isYAML) {
      const string = fs.readFileSync(filePath, 'utf-8')
      return parseString(string)
    } else if (isMarkdown) {
      const string = fs.readFileSync(filePath, 'utf-8')
      return renderMarkdown(string)
    } else if (isJS) {
      return require(filePath)
    } else {
      return includePath
    }
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

const schema = yaml.Schema.create([IncludeYamlType, MarkdownYamlType])

const parseString = (s, filename) => {
  return yaml.safeLoad(s.trim(), { schema, filename })
}

module.exports = {
  parseString,
  fromFile: R.partial(parsing.fromFile, [parseString]),
  fromString: R.partial(parsing.fromString, [parseString])
}
