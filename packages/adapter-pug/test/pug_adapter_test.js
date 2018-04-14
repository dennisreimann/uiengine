const assert = require('assert')
const { assertMatches } = require('../../../test/support/asserts')
const { resolve } = require('path')
const Adapter = require('../src/index')

describe('Pug adapter', () => {
  describe('#render', () => {
    it('should render the template with the given data', async () => {
      const templatePath = resolve(__dirname, 'fixtures', 'template.pug')
      const data = { myData: 1 }
      const rendered = await Adapter.render({}, templatePath, data)

      assert.equal(rendered, '<p>1</p>')
    })

    it('should throw error if the file does not exist', async () => {
      try {
        await Adapter.render({}, 'does-not-exist.pug')
      } catch (error) {
        assert(error)

        assertMatches(error.message, 'Pug could not render "does-not-exist.pug"')
      }
    })

    it('should throw detailed error if the debug option is set', async () => {
      try {
        const templatePath = resolve(__dirname, 'fixtures', 'invalid-template.pug')
        const data = { myData: 1 }
        await Adapter.render({ debug: true }, templatePath, data)
      } catch (error) {
        assert(error)

        assertMatches(error.message, 'p!!= myData')
        assertMatches(error.message, '"myData": 1')
      }
    })
  })

  describe('#filesForComponent', () => {
    it('should return the component file', () => {
      const files = Adapter.filesForComponent('button')

      assert.equal(files.length, 1)
      assert.equal(files[0].basename, 'button.pug')
    })
  })

  describe('#filesForVariant', () => {
    it('should return the variant file', () => {
      const files = Adapter.filesForVariant('button', 'primary')

      assert.equal(files.length, 1)
      assert.equal(files[0].basename, 'primary.pug')
    })
  })
})
