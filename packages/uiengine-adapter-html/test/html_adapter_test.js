const assert = require('assert')
const path = require('path')
const Adapter = require('../src/index')

describe('HTML adapter', () => {
  describe('#render', () => {
    it('should render the template and resolve the includes', done => {
      const templatePath = path.resolve(__dirname, 'fixtures', 'template.html')
      const options = { basedir: path.resolve(__dirname, 'fixtures') }

      Adapter.render(options, templatePath)
        .then(rendered => {
          assert(rendered.match('<p>relative include</p>'), 'Relative include could not be resolved.')
          assert(rendered.match('<p>absolute include</p>'), 'Absolute include could not be resolved.')

          done()
        })
        .catch(done)
    })

    it('should throw error on absolute includes if no basedir option is provided', done => {
      const templatePath = path.resolve(__dirname, 'fixtures', 'template.html')
      const options = {}

      Adapter.render(options, templatePath)
        .catch(error => {
          assert(error)
          done()
        })
    })

    it('should throw error if absolute includes if no baseDir option is provided', done => {
      const templatePath = path.resolve(__dirname, 'fixtures', 'template-error.html')
      const options = {}

      Adapter.render(options, templatePath)
        .catch(error => {
          assert(error)
          done()
        })
    })
  })
})
