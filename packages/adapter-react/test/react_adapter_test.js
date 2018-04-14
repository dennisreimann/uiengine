const assert = require('assert')
const { assertMatches } = require('../../../test/support/asserts')
const { resolve } = require('path')
const Adapter = require('../src/index')

const templatePath = resolve(__dirname, 'fixtures', 'template.jsx')

describe('React adapter', () => {
  describe('#render', () => {
    it('should render the template with the given data', async () => {
      const options = {}
      const data = { myData: 1 }
      const rendered = await Adapter.render(options, templatePath, data)

      assert(rendered.match(/<p data-react(.*?)>1<\/p>/))
    })

    it('should throw error if the file does not exist', async () => {
      try {
        await Adapter.render({}, 'does-not-exist.jsx')
      } catch (error) {
        assert(error)

        assertMatches(error.message, 'React DOM could not render "does-not-exist.jsx"')
      }
    })

    it('should throw detailed error if the debug option is set', async () => {
      try {
        const templatePath = resolve(__dirname, 'fixtures', 'invalid-template.jsx')
        const data = { myData: 1 }
        await Adapter.render({ debug: true }, templatePath, data)
      } catch (error) {
        assert(error)

        assertMatches(error.message, 'invalid-template.jsx')
        assertMatches(error.message, '"myData": 1')
      }
    })
  })

  describe('#registerComponentFile', () => {
    it('should invalidate the module cache', async () => {
      // is set by previous render test
      assert(require.cache[require.resolve(templatePath)])

      await Adapter.registerComponentFile({}, templatePath)

      assert(!require.cache[require.resolve(templatePath)])
    })
  })

  describe('#filesForComponent', () => {
    it('should return the component file', () => {
      const files = Adapter.filesForComponent('button')

      assert.equal(files.length, 1)
      assert.equal(files[0].basename, 'Button.jsx')
    })
  })

  describe('#filesForVariant', () => {
    it('should return the variant file', () => {
      const files = Adapter.filesForVariant('button', 'primary')

      assert.equal(files.length, 1)
      assert.equal(files[0].basename, 'Primary.jsx')
    })
  })
})
