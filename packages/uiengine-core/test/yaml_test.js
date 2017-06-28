const assert = require('assert')
const path = require('path')

const Yaml = require('../src/util/yaml')

const sourcePaths = {
  base: __dirname,
  data: path.join(__dirname, 'fixtures')
}

const string = `
name: Index
included_md: !include /fixtures/markdown.md
data: !data /json.json
content: !markdown |\n  # Headline\n  Text paragraph
include_with_incompatible_type: !include /fixtures/layout.psd
`

describe('Yaml', () => {
  describe('#fromFile', () => {
    it('should return parsed yaml', done => {
      Yaml.fromFile('./test/fixtures/yaml.yml', sourcePaths)
        .then(data => {
          assert.equal(data.name, 'Index')
          assert.equal(data.number, 2)
          done()
        })
        .catch(done)
    })

    it('should include yaml files referenced by relative !include', done => {
      Yaml.fromFile('./test/fixtures/yaml-with-includes.yml', sourcePaths)
        .then(data => {
          assert.equal(data.relative1_include_yaml.name, 'Index')
          assert.equal(data.relative1_include_yaml.number, 2)
          assert.equal(data.relative2_include_yaml.name, 'Index')
          assert.equal(data.relative2_include_yaml.number, 2)
          assert.equal(data.relative3_include_yaml.name, 'Index')
          assert.equal(data.relative3_include_yaml.number, 2)
          done()
        })
        .catch(done)
    })

    it('should include yaml files referenced by absolute !include', done => {
      Yaml.fromFile('./test/fixtures/yaml-with-includes.yml', sourcePaths)
        .then(data => {
          assert.equal(data.absolute_include_yaml.name, 'Index')
          assert.equal(data.absolute_include_yaml.number, 2)
          assert.equal(data.nested_include.absolute_include.number, 2)
          assert.equal(data.nested_include.relative_include.number, 2)
          done()
        })
        .catch(done)
    })

    it('should include yaml files referenced by !data', done => {
      Yaml.fromFile('./test/fixtures/yaml-with-includes.yml', sourcePaths)
        .then(data => {
          assert.equal(data.data_yaml.name, 'Index')
          assert.equal(data.data_yaml.number, 2)
          assert.equal(data.data_nested.absolute_data.number, 2)
          assert.equal(data.data_nested.relative_data.number, 2)
          done()
        })
        .catch(done)
    })

    it('should include json files referenced by !data', done => {
      Yaml.fromFile('./test/fixtures/yaml-with-includes.yml', sourcePaths)
        .then(data => {
          assert.equal(data.data_json.name, 'JSON')
          assert.equal(data.data_json.number, 3)
          done()
        })
        .catch(done)
    })

    it('should include js files referenced by !data', done => {
      Yaml.fromFile('./test/fixtures/yaml-with-includes.yml', sourcePaths)
        .then(data => {
          assert.equal(data.data_js.name, 'Included JS')
          assert.equal(data.data_js.number, 4)
          done()
        })
        .catch(done)
    })

    it('should include markdown files referenced by !data', done => {
      Yaml.fromFile('./test/fixtures/yaml-with-includes.yml', sourcePaths)
        .then(data => {
          assert.equal(data.data_md, '<h1 id="homepage">Homepage</h1>\n<p>Welcome!</p>')
          done()
        })
        .catch(done)
    })
  })

  describe('#fromString', () => {
    it('should return parsed yaml', done => {
      Yaml.fromString('name: Index\nnumber: 2', sourcePaths)
        .then(data => {
          assert.equal(data.name, 'Index')
          assert.equal(data.number, 2)
          done()
        })
        .catch(done)
    })

    it('should parse with custom markdown type', done => {
      Yaml.fromString(string, sourcePaths)
        .then(data => {
          assert.equal(data.included_md, '<h1 id="homepage">Homepage</h1>\n<p>Welcome!</p>')
          assert.equal(data.content, '<h1 id="headline">Headline</h1>\n<p>Text paragraph</p>')
          assert.equal(data.data.name, 'JSON')
          assert.equal(data.data.number, 3)
          assert.equal(data.include_with_incompatible_type, path.resolve(__dirname, 'fixtures', 'layout.psd'))
          done()
        })
        .catch(done)
    })

    it('should allow duplicate keys and override and extend previous values', done => {
      Yaml.fromString('object:\n  value1: 1\n  value2: 2\nobject:\n  value1: 1\n  value2:\n    nested: 3\n  value3: 4', sourcePaths)
        .then(data => {
          assert.equal(data.object.value1, 1)
          assert.equal(data.object.value2.nested, 3)
          assert.equal(data.object.value3, 4)
          done()
        })
        .catch(done)
    })

    it('should throw error with invalid YAML', done => {
      Yaml.fromString(': invalid', sourcePaths)
        .catch(error => {
          assert(error)
          done()
        })
    })
  })
})
