const assert = require('assert')
const { join } = require('path')

const Markdown = require('../src/util/markdown')

describe('Markdown', () => {
  describe('#fromFile', () => {
    it('should return rendered markdown', async () => {
      const data = await Markdown.fromFile(join(__dirname, 'fixtures/markdown.md'))

      assert.equal(data, '<h1 id="homepage">Homepage</h1>\n<p>Welcome!</p>')
    })
  })

  describe('#fromString', () => {
    it('should return rendered markdown', async () => {
      const data = await Markdown.fromString('# Homepage\n\nWelcome!')

      assert.equal(data, '<h1 id="homepage">Homepage</h1>\n<p>Welcome!</p>')
    })
  })
})
