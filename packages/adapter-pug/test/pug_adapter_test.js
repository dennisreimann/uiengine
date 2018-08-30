const assert = require('assert')
const { resolve } = require('path')
const Adapter = require('../src/index')

describe('Pug adapter', () => {
  describe('#render', () => {
    it('should render the template with the given data', async () => {
      const templatePath = resolve(__dirname, 'fixtures', 'template.pug')
      const data = { myData: 1 }
      const rendered = await Adapter.render({}, templatePath, data)

      assert.strictEqual(rendered, '<p>1</p>')
    })

    it('should throw error if the file does not exist', async () => {
      try {
        await Adapter.render({}, 'does-not-exist.pug')
      } catch (error) {
        assert(error)
      }
    })
  })

  describe('#filesForComponent', () => {
    it('should return the component file', () => {
      const files = Adapter.filesForComponent('button')

      assert.strictEqual(files.length, 1)
      assert.strictEqual(files[0].basename, 'button.pug')
    })
  })

  describe('#filesForVariant', () => {
    it('should return the variant file', () => {
      const files = Adapter.filesForVariant('button', 'primary')

      assert.strictEqual(files.length, 1)
      assert.strictEqual(files[0].basename, 'primary.pug')
    })
  })
})
