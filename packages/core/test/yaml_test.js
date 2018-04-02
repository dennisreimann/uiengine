const assert = require('assert')
const { join, resolve } = require('path')

const Yaml = require('../src/util/yaml')

const sourcePaths = {
  base: __dirname,
  data: join(__dirname, 'fixtures')
}

const yaml = join(__dirname, 'fixtures/yaml.yml')
const yamlWithExtends = join(__dirname, 'fixtures/yaml-with-extends.yml')
const yamlWithIncludes = join(__dirname, 'fixtures/yaml-with-includes.yml')

const string = `
name: Index
included_md: !include /fixtures/markdown.md
data: !data /json.json
content: !markdown |\n  # Headline\n  Text paragraph
include_with_incompatible_type: !include /fixtures/layout.psd
`

describe('Yaml', () => {
  describe('#fromFile', () => {
    it('should return parsed yaml', async () => {
      const data = await Yaml.fromFile(yaml, sourcePaths)

      assert.equal(data.name, 'Index')
      assert.equal(data.number, 2)
    })

    it('should include yaml files referenced by relative !include', async () => {
      const data = await Yaml.fromFile(yamlWithIncludes, sourcePaths)

      assert.equal(data.relative1_include_yaml.name, 'Index')
      assert.equal(data.relative1_include_yaml.number, 2)
      assert.equal(data.relative2_include_yaml.name, 'Index')
      assert.equal(data.relative2_include_yaml.number, 2)
      assert.equal(data.relative3_include_yaml.name, 'Index')
      assert.equal(data.relative3_include_yaml.number, 2)
    })

    it('should include yaml files referenced by absolute !include', async () => {
      const data = await Yaml.fromFile(yamlWithIncludes, sourcePaths)

      assert.equal(data.absolute_include_yaml.name, 'Index')
      assert.equal(data.absolute_include_yaml.number, 2)
      assert.equal(data.nested_include.absolute_include.number, 2)
      assert.equal(data.nested_include.relative_include.number, 2)
    })

    it('should include yaml files referenced by !data', async () => {
      const data = await Yaml.fromFile(yamlWithIncludes, sourcePaths)

      assert.equal(data.data_yaml.name, 'Index')
      assert.equal(data.data_yaml.number, 2)
      assert.equal(data.data_nested.absolute_data.number, 2)
      assert.equal(data.data_nested.relative_data.number, 2)
    })

    it('should include json files referenced by !data', async () => {
      const data = await Yaml.fromFile(yamlWithIncludes, sourcePaths)

      assert.equal(data.data_json.name, 'JSON')
      assert.equal(data.data_json.number, 3)
    })

    it('should include js files referenced by !data', async () => {
      const data = await Yaml.fromFile(yamlWithIncludes, sourcePaths)

      assert.equal(data.data_js.name, 'Included JS')
      assert.equal(data.data_js.number, 4)
    })

    it('should include markdown files referenced by !data', async () => {
      const data = await Yaml.fromFile(yamlWithIncludes, sourcePaths)

      assert.equal(data.data_md, '<h1 id="homepage">Homepage</h1>\n<p>Welcome!</p>')
    })

    it('should extend data structures by deep merging them', async () => {
      const data = await Yaml.fromFile(yamlWithExtends, sourcePaths)

      assert.equal(data.name, 'Index')
      assert.equal(data.number, 3)
      assert.equal(data.nested.name, 'Index')
      assert.equal(data.nested.number, 4)
      assert.equal(data.nested.deep.extended, true)
      assert.equal(data.nested.deep.overwritten, true)
    })
  })

  describe('#fromString', () => {
    it('should return parsed yaml', async () => {
      const data = await Yaml.fromString('name: Index\nnumber: 2', sourcePaths)

      assert.equal(data.name, 'Index')
      assert.equal(data.number, 2)
    })

    it('should parse with custom markdown type', async () => {
      const data = await Yaml.fromString(string, sourcePaths)

      assert.equal(data.included_md, '<h1 id="homepage">Homepage</h1>\n<p>Welcome!</p>')
      assert.equal(data.content, '<h1 id="headline">Headline</h1>\n<p>Text paragraph</p>')
      assert.equal(data.data.name, 'JSON')
      assert.equal(data.data.number, 3)
      assert.equal(data.include_with_incompatible_type, resolve(__dirname, 'fixtures', 'layout.psd'))
    })

    it('should allow duplicate keys and override and extend previous values', async () => {
      const data = await Yaml.fromString('object:\n  value1: 1\n  value2: 2\nobject:\n  value1: 1\n  value2:\n    nested: 3\n  value3: 4', sourcePaths)

      assert.equal(data.object.value1, 1)
      assert.equal(data.object.value2.nested, 3)
      assert.equal(data.object.value3, 4)
    })

    it('should throw error with invalid YAML', async () => {
      try {
        await Yaml.fromString(': invalid', sourcePaths)
      } catch (error) {
        assert(error)
      }
    })
  })
})
