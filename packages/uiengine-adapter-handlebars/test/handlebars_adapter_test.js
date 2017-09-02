const assert = require('assert')
const path = require('path')
const Adapter = require('../src/index')

describe('Handlebars adapter', () => {
  describe('#render', () => {
    it('should render the template with the given data', done => {
      const templatePath = path.resolve(__dirname, 'fixtures', 'template.hbs')
      const options = {}
      const data = { myData: 1 }

      Adapter.render(options, templatePath, data)
        .then(rendered => {
          assert.equal(rendered, '<p>1</p>\n')

          done()
        })
        .catch(done)
    })
  })
})
