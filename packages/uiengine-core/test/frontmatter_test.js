/* global describe, it */
const assert = require('assert')

const Frontmatter = require('../src/util/frontmatter')

const string = `
---
name: Index
included_md: !include /test/fixtures/markdown.md
content: !markdown |\n  # Headline\n  Text paragraph
---
Hello
`

describe('Frontmatter', () => {
  describe('#fromFile', () => {
    it('should return attributes and body', done => {
      Frontmatter.fromFile('./test/fixtures/frontmatter.txt')
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
      Frontmatter.fromString(string)
        .then(data => {
          assert.equal(data.attributes.name, 'Index')
          assert.equal(data.body, 'Hello')
          done()
        })
        .catch(done)
    })

    it('should work with custom yaml types', done => {
      Frontmatter.fromString(string)
        .then(data => {
          assert.equal(data.attributes.included_md, '<h1 id="homepage">Homepage</h1>\n<p>Welcome!</p>')
          assert.equal(data.attributes.content, '<h1 id="headline">Headline</h1>\n<p>Text paragraph</p>')
          done()
        })
        .catch(done)
    })
  })
})
