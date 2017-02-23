const R = require('ramda')
const fs = require('fs')
const path = require('path')
const assert = require('assert')
const yaml = require('js-yaml')
const parsing = require('./parsing')

const IncludeYamlType = new yaml.Type('!include', {
  kind: 'scalar',

  construct (includePath, a, b, c) {
    assert(path.isAbsolute(includePath), 'YAML Include Schema requires an absolute path (its root is the current working directory)')

    const isYAML = includePath.match(/\.ya?ml$/)
    const isJS = includePath.match(/\.js(on)?$/)

    if (isYAML || isJS) {
      const filePath = path.join(process.cwd(), includePath)

      if (isYAML) {
        return parseString(fs.readFileSync(filePath, 'utf-8'))
      } else {
        return require(filePath)
      }
    } else {
      return includePath
    }
  }
})

const schema = yaml.Schema.create([IncludeYamlType])

const parseString = (s, filename) => {
  return yaml.safeLoad(s.trim(), { schema, filename })
}

module.exports = {
  fromFile: R.partial(parsing.fromFile, [parseString]),
  fromString: R.partial(parsing.fromString, [parseString])
}
