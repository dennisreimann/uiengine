/* global describe, it */
const assert = require('assert')

const Frontmatter = require('../lib/util/frontmatter')

const string = `
---
name: Index
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
  })
})
