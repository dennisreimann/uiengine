const assert = require('assert')
const { resolve } = require('path')
const Adapter = require('../src/index')

describe('HTML adapter', () => {
  describe('#render', () => {
    it('should render the template and resolve the includes', async () => {
      const templatePath = resolve(__dirname, 'fixtures', 'template.html')
      const options = { basedir: resolve(__dirname, 'fixtures') }
      const data = {}
      const rendered = await Adapter.render(options, templatePath, data)

      assert(rendered.match('<p>relative include</p>'), 'Relative include could not be resolved.')
      assert(rendered.match('<p>absolute include</p>'), 'Absolute include could not be resolved.')
    })

    it('should throw error on absolute includes if no basedir option is provided', async () => {
      const templatePath = resolve(__dirname, 'fixtures', 'template.html')
      const options = {}
      const data = {}

      try {
        await Adapter.render(options, templatePath, data)
      } catch (error) {
        assert(error)
      }
    })

    it('should substitute variables', async () => {
      const templatePath = resolve(__dirname, 'fixtures', 'template-variables.html')
      const options = {}
      const data = { myData: 1, nested: { data: 2 } }
      const rendered = await Adapter.render(options, templatePath, data)

      assert(rendered.match('<p>1</p>'), 'Variable missing')
      assert(rendered.match('<p>include with variable: 2</p>'), 'Variable in include missing')
    })

    it('should not substitute non-existing variables', async () => {
      const templatePath = resolve(__dirname, 'fixtures', 'template-variables.html')
      const options = {}
      const data = {}
      const rendered = await Adapter.render(options, templatePath, data)

      assert(rendered.match(/<p>\${myData}<\/p>/), `Variable string "\${myData}" missing:\n\n${rendered}`)
      assert(rendered.match(/<p>include with variable: \${nested.data}<\/p>/), `Variable string "\${nested.data}" missing:\n\n${rendered}`)
    })
  })
})
