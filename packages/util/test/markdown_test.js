const assert = require('assert')
const { join } = require('path')

const MarkdownUtil = require('../src/markdown')

describe('MarkdownUtil', () => {
  describe('#fromFile', () => {
    it('should return rendered markdown', async () => {
      const data = await MarkdownUtil.fromFile(join(__dirname, 'fixtures/markdown.md'))

      assert.strictEqual(data, '<h1 id="homepage" tabindex="-1">Homepage</h1>\n<p>Welcome!</p>')
    })
  })

  describe('#fromString', () => {
    it('should return rendered markdown', async () => {
      const data = await MarkdownUtil.fromString('# Homepage\n\nWelcome!')

      assert.strictEqual(data, '<h1 id="homepage" tabindex="-1">Homepage</h1>\n<p>Welcome!</p>')
    })
  })
})
