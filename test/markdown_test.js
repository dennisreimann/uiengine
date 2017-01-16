/* global describe, it */
const assert = require('assert')

const Markdown = require('../lib/util/markdown')

describe('Markdown', () => {
  describe('#readFile', () => {
    it('should return rendered markdown', (done) => {
      Markdown.readFile('./test/project/pages/page.md')
        .then(data => {
          assert.equal(data, '<h1>Homepage</h1>\n<p>Welcome!</p>\n')
          done()
        })
        .catch(done)
    })
  })
})
