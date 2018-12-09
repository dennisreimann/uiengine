const assert = require('assert')
const { resolve } = require('path')
const Adapter = require('../src/index')

const templatePath = file => resolve(__dirname, 'fixtures', file)

describe('Vue adapter @nowatch', () => {
  describe('#render', () => {
    describe('html template', function () {
      this.timeout(10000)

      describe('with custom bundle', () => {
        it('should render the vue template with the given data', async () => {
          const tmplPath = templatePath('template.vhtml')
          const options = { bundle: resolve(__dirname, '../../../test/fixtures/vue-server.js') }
          const data = { myData: 1 }
          const rendered = await Adapter.render(options, tmplPath, data)

          assert.strictEqual('<p data-server-rendered="true">1</p>', rendered)
        })
      })

      describe('without custom bundle', () => {
        it('should render the vue template with the given data', async () => {
          const tmplPath = templatePath('template.vhtml')
          const options = {}
          const data = { myData: 1 }
          const rendered = await Adapter.render(options, tmplPath, data)

          assert.strictEqual('<p data-server-rendered="true">1</p>', rendered)
        })
      })
    })

    describe('js template', () => {
      it('should render the exported component with the given data', async () => {
        const tmplPath = templatePath('template-export.js')
        const options = {}
        const data = { myData: 1 }
        const rendered = await Adapter.render(options, tmplPath, data)

        assert.strictEqual('<p data-server-rendered="true">1</p>', rendered)
      })

      it('should render the globally registered component with the given data', async () => {
        const tmplPath = templatePath('template-register.js')
        const options = {}
        const data = { myData: 1 }
        const rendered = await Adapter.render(options, tmplPath, data)

        assert.strictEqual('<p data-server-rendered="true">1</p>', rendered)
      })

      it('should throw error with no exported component', async () => {
        const tmplPath = templatePath('template-register-no-export.js')
        const options = {}
        const data = {}

        try {
          await Adapter.render(options, tmplPath, data)
        } catch (error) {
          assert(error)
        }
      })
    })
  })
})
