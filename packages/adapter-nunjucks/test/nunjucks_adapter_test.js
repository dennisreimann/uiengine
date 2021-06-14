const assert = require('assert')
const { join, resolve } = require('path')
const Adapter = require('../src/index')

const basePath = join(__dirname, 'fixtures')
const elementsPath = join(basePath, 'elements')
const modulesPath = join(basePath, 'modules')
const templatePath = resolve(basePath, 'template.njk')
const filterTemplatePath = resolve(basePath, 'filter.njk')

const adapterOptions = {
  components: [basePath, elementsPath, modulesPath],
  templates: basePath,
  searchPaths: [basePath]
}

describe('Nunjucks adapter', () => {
  before(() => Adapter.setup(adapterOptions))
  afterEach(function () {
    this.sinon.restore()
  })

  describe('#render', () => {
    it('should render the template with the given data', async () => {
      const data = { myData: 1 }
      const rendered = await Adapter.render(adapterOptions, templatePath, data)

      assert.strictEqual(rendered.trim(), '<p>1</p>')
    })

    it('should render the template with the given globals', async () => {
      const options = {
        ...adapterOptions,
        globals: {
          var: 'name'
        }
      }
      const data = { myData: 1 }
      const rendered = await Adapter.render(options, templatePath, data)

      assert.strictEqual(rendered.trim(), '<p>1<span> name</span></p>')
    })

    it('should render the template with the given filters', async () => {
      const options = {
        ...adapterOptions,
        filters: {
          shorten: (str, count) => {
            return str.slice(0, count || 6)
          }
        }
      }
      const data = { title: 'Glastonbury Festival' }
      const rendered = await Adapter.render(options, filterTemplatePath, data)

      assert.strictEqual(rendered.trim(), '<p>Glasto</p>')
    })

    it('should resolve the includes', async () => {
      const templatePath = resolve(__dirname, 'fixtures', 'includes.njk')
      const options = { templates: basePath, components: basePath }
      const data = {}
      const rendered = await Adapter.render(options, templatePath, data)

      assert(rendered.match('<p>relative include</p>'), 'Relative include could not be resolved.')
    })

    it('should throw error if the file does not exist', async () => {
      try {
        await Adapter.render({}, 'does-not-exist.njk')
      } catch (error) {
        assert(error)
      }
    })
  })

  describe('#filesForComponent', () => {
    it('should return the component file', () => {
      const files = Adapter.filesForComponent({}, 'button')

      assert.strictEqual(files.length, 1)
      assert.strictEqual(files[0].basename, 'button.njk')
    })
  })

  describe('#filesForVariant', () => {
    it('should return the variant file', () => {
      const files = Adapter.filesForVariant({}, 'button', 'primary')

      assert.strictEqual(files.length, 1)
      assert.strictEqual(files[0].basename, 'primary.njk')
    })
  })
})
