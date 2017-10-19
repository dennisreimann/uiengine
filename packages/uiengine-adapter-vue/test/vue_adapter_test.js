const assert = require('assert')
const path = require('path')
const Adapter = require('../src/index')

describe('Vue adapter', () => {
  describe.only('#render', () => {
    describe('vue template', () => {
      it('should render the vue template with the given data', done => {
        const templatePath = path.resolve(__dirname, 'fixtures', 'template.vue')
        const options = {}
        const data = { myData: 1 }

        Adapter.render(options, templatePath, data)
          .then(rendered => {
            assert.equal('<p data-server-rendered="true">1</p>', rendered)

            done()
          })
          .catch(done)
      })
    })

    describe('js template', () => {
      it('should render the exported component with the given data', done => {
        const templatePath = path.resolve(__dirname, 'fixtures', 'template-export.js')
        const options = {}
        const data = { myData: 1 }

        Adapter.render(options, templatePath, data)
          .then(rendered => {
            assert.equal('<p data-server-rendered="true">1</p>', rendered)

            done()
          })
          .catch(done)
      })

      it('should render the globally registered component with the given data', done => {
        const templatePath = path.resolve(__dirname, 'fixtures', 'template-register.js')
        const options = {}
        const data = { myData: 1 }

        Adapter.render(options, templatePath, data)
          .then(rendered => {
            assert.equal('<p data-server-rendered="true">1</p>', rendered)

            done()
          })
          .catch(done)
      })

      it('should throw error with no exported component', done => {
        const templatePath = path.resolve(__dirname, 'fixtures', 'template-register-no-export.js')
        const options = {}
        const data = { }

        Adapter.render(options, templatePath, data)
          .catch(error => {
            assert(error)
            done()
          })
      })
    })
  })
})
