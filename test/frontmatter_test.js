const assert = require('assert')
const path = require('path')

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
  data: path.join(__dirname, 'fixtures')
}

describe('Frontmatter', () => {
  describe('#fromFile', () => {
    it('should return attributes and body', done => {
      Frontmatter.fromFile('./test/fixtures/frontmatter.txt', sourcePaths)
        .then(data => {
          assert.equal(data.attributes.name, 'Index')
          assert.equal(data.body, 'Hello')
          done()
        })
        .catch(done)
    })
  })

  describe('#fromString', () => {
    it('should return attributes and body', done => {
      const string = `---\nname: Index\n---\nHello`
      Frontmatter.fromString(string, sourcePaths)
        .then(data => {
          assert.equal(data.attributes.name, 'Index')
          assert.equal(data.body, 'Hello')
          done()
        })
        .catch(done)
    })

    it('should work with only the attributes', done => {
      const string = `---\nname: Index\n---`
      Frontmatter.fromString(string, sourcePaths)
        .then(data => {
          assert.equal(data.attributes.name, 'Index')
          assert.equal(data.body, '')
          done()
        })
        .catch(done)
    })

    it('should work with only the body', done => {
      const string = 'Hello'
      Frontmatter.fromString(string, sourcePaths)
        .then(data => {
          assert.equal(Object.keys(data.attributes).length, 0)
          assert.equal(data.body, 'Hello')
          done()
        })
        .catch(done)
    })

    it('should work with malformed string', done => {
      const string = '---\nHello'
      Frontmatter.fromString(string, sourcePaths)
        .then(data => {
          assert.equal(Object.keys(data.attributes).length, 0)
          assert.equal(data.body, '---\nHello')
          done()
        })
        .catch(done)
    })

    it('should work with custom yaml types', done => {
      Frontmatter.fromString(string, sourcePaths)
        .then(data => {
          assert.equal(data.attributes.included_md, '<h1 id="homepage">Homepage</h1>\n<p>Welcome!</p>')
          assert.equal(data.attributes.content, '<h1 id="headline">Headline</h1>\n<p>Text paragraph</p>')
          assert.equal(data.attributes.data.name, 'JSON')
          assert.equal(data.attributes.data.number, 3)
          done()
        })
        .catch(done)
    })
  })
})
