const assert = require('assert')
const { resolve } = require('path')
const Handlebars = require('handlebars')
const Adapter = require('../src/index')

const options = {}
const data = { myData: 1 }
const templatePath = resolve(__dirname, 'fixtures', 'template.hbs')
const components = [resolve(__dirname, 'fixtures', 'components')]

describe('Handlebars adapter', () => {
  describe('#setup', () => {
    it('should register all components files', async () => {
      await Adapter.setup({ components, ext: 'hbs' })

      assert.strictEqual(Handlebars.partials.button.trim(), '<button>{{title}}</button>')
    })
  })

  describe('#render', () => {
    it('should render the template with the given data', async () => {
      const rendered = await Adapter.render(options, templatePath, data)

      assert.strictEqual(rendered.trim(), '<p>1</p>')
    })

    it('should throw error if the file does not exist', async () => {
      try {
        await Adapter.render(options, 'does-not-exist.hbs')
      } catch (error) {
        assert(error)
      }
    })
  })

  describe('#registerComponentFile', () => {
    it('should register the template as partial', async () => {
      await Adapter.registerComponentFile(options, templatePath)

      assert.strictEqual(Handlebars.partials.template.trim(), '<p>{{myData}}</p>')
    })

    it('should register the template as namespaced partial', async () => {
      await Adapter.registerComponentFile({ namespace: 'adapter' }, templatePath)

      assert.strictEqual(Handlebars.partials['adapter/template'].trim(), '<p>{{myData}}</p>')
    })

    it('should throw error if the file does not exist', async () => {
      try {
        await Adapter.registerComponentFile(options, 'does-not-exist.hbs')
      } catch (error) {
        assert(error)
      }
    })
  })
})
