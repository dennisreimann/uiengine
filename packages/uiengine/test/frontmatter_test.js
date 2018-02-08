const assert = require('assert')
const { join } = require('path')

const Frontmatter = require('../src/util/frontmatter')

const string = `
---
name: Index
included_md: !include /fixtures/markdown.md
data: !data /json.json
content: !markdown |\n  # Headline\n  Text paragraph
---
Hello
`

const sourcePaths = {
  base: __dirname,
  data: join(__dirname, 'fixtures')
}

describe('Frontmatter', () => {
  describe('#fromFile', () => {
    it('should return attributes and body', async () => {
      const data = await Frontmatter.fromFile(join(__dirname, 'fixtures/frontmatter.txt'), sourcePaths)

      assert.equal(data.attributes.name, 'Index')
      assert.equal(data.body, 'Hello')
    })
  })

  describe('#fromString', () => {
    it('should return attributes and body', async () => {
      const string = `---\nname: Index\n---\nHello`
      const data = await Frontmatter.fromString(string, sourcePaths)

      assert.equal(data.attributes.name, 'Index')
      assert.equal(data.body, 'Hello')
    })

    it('should work with only the attributes', async () => {
      const string = `---\nname: Index\n---`
      const data = await Frontmatter.fromString(string, sourcePaths)

      assert.equal(data.attributes.name, 'Index')
      assert.equal(data.body, '')
    })

    it('should work with empty attributes and empty body', async () => {
      const string = `---\n\n---\n`
      const data = await Frontmatter.fromString(string, sourcePaths)

      assert.equal(Object.keys(data.attributes).length, 0)
      assert.equal(data.body, '')
    })

    it('should work with only the body', async () => {
      const string = 'Hello'
      const data = await Frontmatter.fromString(string, sourcePaths)

      assert.equal(Object.keys(data.attributes).length, 0)
      assert.equal(data.body, 'Hello')
    })

    it('should work with malformed string', async () => {
      const string = '---\nHello'
      const data = await Frontmatter.fromString(string, sourcePaths)

      assert.equal(Object.keys(data.attributes).length, 0)
      assert.equal(data.body, '---\nHello')
    })

    it('should work with custom yaml types', async () => {
      const data = await Frontmatter.fromString(string, sourcePaths)

      assert.equal(data.attributes.included_md, '<h1 id="homepage">Homepage</h1>\n<p>Welcome!</p>')
      assert.equal(data.attributes.content, '<h1 id="headline">Headline</h1>\n<p>Text paragraph</p>')
      assert.equal(data.attributes.data.name, 'JSON')
      assert.equal(data.attributes.data.number, 3)
    })
  })
})
