const assert = require('assert')
const { resolve } = require('path')
const Adapter = require('../src/index')

describe('React adapter', () => {
  describe('#render', () => {
    it('should render the template with the given data', done => {
      const templatePath = resolve(__dirname, 'fixtures', 'template.jsx')
      const options = {}
      const data = { myData: 1 }

      Adapter.render(options, templatePath, data)
        .then(rendered => {
          assert(rendered.match(/<p data-react(.*?)>1<\/p>/))

          done()
        })
        .catch(done)
    })
  })
})
