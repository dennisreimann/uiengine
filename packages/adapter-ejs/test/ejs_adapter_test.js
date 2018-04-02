const assert = require('assert')
const { resolve } = require('path')
const Adapter = require('../src/index')

describe('EJS adapter', () => {
  describe('#render', () => {
    it('should render the template with the given data', async () => {
      const templatePath = resolve(__dirname, 'fixtures', 'template.ejs')
      const options = {}
      const data = { myData: 1 }
      const rendered = await Adapter.render(options, templatePath, data)

      assert.equal(rendered, '<p>1</p>\n')
    })

    it('should resolve the includes', async () => {
      const templatePath = resolve(__dirname, 'fixtures', 'includes.ejs')
      const options = { root: resolve(__dirname, 'fixtures') }
      const data = {}
      const rendered = await Adapter.render(options, templatePath, data)

      assert(rendered.match('<p>relative include</p>'), 'Relative include could not be resolved.')
      assert(rendered.match('<p>absolute include</p>'), 'Absolute include could not be resolved.')
    })
  })

  describe('#filesForComponent', () => {
    it('should return the component file', () => {
      const files = Adapter.filesForComponent('button')

      assert.equal(files.length, 1)
      assert.equal(files[0].basename, 'button.ejs')
    })
  })

  describe('#filesForVariant', () => {
    it('should return the variant file', () => {
      const files = Adapter.filesForVariant('button', 'primary')

      assert.equal(files.length, 1)
      assert.equal(files[0].basename, 'primary.ejs')
    })
  })
})
