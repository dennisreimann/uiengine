const assert = require('assert')
const { assertMatches } = require('../../../test/support/asserts')
const { resolve } = require('path')
const Handlebars = require('handlebars')
const Adapter = require('../src/index')

const options = {}
const data = { myData: 1 }
const templatePath = resolve(__dirname, 'fixtures', 'template.hbs')
const componentsPath = resolve(__dirname, 'fixtures', 'components')

describe('Handlebars adapter', () => {
  describe('#setup', () => {
    it('should register all components files', async () => {
      await Adapter.setup({ components: componentsPath, ext: 'hbs' })

      assert.strictEqual(Handlebars.partials['button'], '<button>{{title}}</button>\n')
    })
  })

  describe('#render', () => {
    it('should render the template with the given data', async () => {
      const rendered = await Adapter.render(options, templatePath, data)

      assert.strictEqual(rendered, '<p>1</p>\n')
    })

    it('should throw error if the file does not exist', async () => {
      try {
        await Adapter.render(options, 'does-not-exist.hbs')
      } catch (error) {
        assert(error)

        assertMatches(error.message, 'Handlebars could not handle "does-not-exist.hbs"')
      }
    })

    it('should throw detailed error if the debug option is set', async () => {
      try {
        const templatePath = resolve(__dirname, 'fixtures', 'invalid-template.hbs')
        await Adapter.render({ debug: true }, templatePath, data)
      } catch (error) {
        assert(error)

        assertMatches(error.message, '<p>{{myData')
        assertMatches(error.message, '"myData": 1')
      }
    })
  })

  describe('#registerComponentFile', () => {
    it('should register the template as partial', async () => {
      await Adapter.registerComponentFile(options, templatePath)

      assert.strictEqual(Handlebars.partials['template'], '<p>{{myData}}</p>\n')
    })

    it('should register the template as namespaced partial', async () => {
      await Adapter.registerComponentFile({ namespace: 'adapter' }, templatePath)

      assert.strictEqual(Handlebars.partials['adapter/template'], '<p>{{myData}}</p>\n')
    })

    it('should throw error if the file does not exist', async () => {
      try {
        await Adapter.registerComponentFile(options, 'does-not-exist.hbs')
      } catch (error) {
        assert(error)

        assertMatches(error.message, 'Handlebars could not handle "does-not-exist.hbs"')
      }
    })

    it('should throw detailed error if the debug option is set', async () => {
      try {
        const templatePath = resolve(__dirname, 'fixtures', 'invalid-template.hbs')
        await Adapter.registerComponentFile({ debug: true }, templatePath)
      } catch (error) {
        assert(error)

        assertMatches(error.message, '<p>{{myData')
      }
    })
  })
})
