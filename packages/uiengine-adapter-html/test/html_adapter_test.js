const assert = require('assert')
const { resolve } = require('path')
const Adapter = require('../src/index')

describe('HTML adapter', () => {
  describe('#render', () => {
    it('should render the template and resolve the includes', done => {
      const templatePath = resolve(__dirname, 'fixtures', 'template.html')
      const options = { basedir: resolve(__dirname, 'fixtures') }
      const data = {}

      Adapter.render(options, templatePath, data)
        .then(rendered => {
          assert(rendered.match('<p>relative include</p>'), 'Relative include could not be resolved.')
          assert(rendered.match('<p>absolute include</p>'), 'Absolute include could not be resolved.')

          done()
        })
        .catch(done)
    })

    it('should throw error on absolute includes if no basedir option is provided', done => {
      const templatePath = resolve(__dirname, 'fixtures', 'template.html')
      const options = {}
      const data = {}

      Adapter.render(options, templatePath, data)
        .catch(error => {
          assert(error)
          done()
        })
    })

    it('should substitute variables', done => {
      const templatePath = resolve(__dirname, 'fixtures', 'template-variables.html')
      const options = {}
      const data = { myData: 1, nested: { data: 2 } }

      Adapter.render(options, templatePath, data)
        .then(rendered => {
          assert(rendered.match('<p>1</p>'), 'Variable missing')
          assert(rendered.match('<p>include with variable: 2</p>'), 'Variable in include missing')

          done()
        })
        .catch(done)
    })

    it('should not substitute non-existing variables', done => {
      const templatePath = resolve(__dirname, 'fixtures', 'template-variables.html')
      const options = {}
      const data = {}

      Adapter.render(options, templatePath, data)
        .then(rendered => {
          assert(rendered.match(/<p>\${myData}<\/p>/), `Variable string "\${myData}" missing:\n\n${rendered}`)
          assert(rendered.match(/<p>include with variable: \${nested.data}<\/p>/), `Variable string "\${nested.data}" missing:\n\n${rendered}`)

          done()
        })
        .catch(done)
    })
  })
})
