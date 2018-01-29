const assert = require('assert')
const { resolve } = require('path')
const Adapter = require('../src/index')

const templatePath = file => resolve(__dirname, 'fixtures', file)

describe('Vue adapter', () => {
  describe('#render', () => {
    describe('html template', function () {
      this.timeout(5000)

      describe('with custom bundle', () => {
        it('should render the vue template with the given data', done => {
          const tmplPath = templatePath('template.vhtml')
          const options = { bundle: resolve(__dirname, '../../../test/fixtures/vue-server.js') }
          const data = { myData: 1 }

          Adapter.render(options, tmplPath, data)
            .then(rendered => {
              assert.equal('<p data-server-rendered="true">1</p>', rendered)

              done()
            })
            .catch(done)
        })
      })

      describe('without custom bundle', () => {
        it('should render the vue template with the given data', done => {
          const tmplPath = templatePath('template.vhtml')
          const options = {}
          const data = { myData: 1 }

          Adapter.render(options, tmplPath, data)
            .then(rendered => {
              assert.equal('<p data-server-rendered="true">1</p>', rendered)

              done()
            })
            .catch(done)
        })
      })
    })

    describe('js template', () => {
      it('should render the exported component with the given data', done => {
        const tmplPath = templatePath('template-export.js')
        const options = {}
        const data = { myData: 1 }

        Adapter.render(options, tmplPath, data)
          .then(rendered => {
            assert.equal('<p data-server-rendered="true">1</p>', rendered)

            done()
          })
          .catch(done)
      })

      it('should render the globally registered component with the given data', done => {
        const tmplPath = templatePath('template-register.js')
        const options = {}
        const data = { myData: 1 }

        Adapter.render(options, tmplPath, data)
          .then(rendered => {
            assert.equal('<p data-server-rendered="true">1</p>', rendered)

            done()
          })
          .catch(done)
      })

      it('should throw error with no exported component', done => {
        const tmplPath = templatePath('template-register-no-export.js')
        const options = {}
        const data = {}

        Adapter.render(options, tmplPath, data)
          .catch(error => {
            assert(error)
            done()
          })

        // const options = {}
        // const data = { myData: 1 }

        // Adapter.render(options, tmplPath, data)
        //   .then(rendered => {
        //     assert.equal('<p data-server-rendered="true">1</p>', rendered)

        //     done()
        //   })
        //   .catch(done)
      })
    })
  })
})
