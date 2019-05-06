require('mocha-sinon')()

const assert = require('assert')
const { assertMatches } = require('../../../test/support/asserts')
const { join } = require('path')

const Adapter = require('../src/index')

const basePath = join(__dirname, 'fixtures/vue')

const options = require(join(basePath, 'adapter_options'))

describe('Webpack adapter with Vue templates', () => {
  afterEach(function () {
    this.sinon.restore()
  })

  describe('#render', () => {
    it('should throw error if the file does not exist', async function () {
      this.sinon.stub(console, 'error')

      try {
        await Adapter.render(options, 'does-not-exist.vue')
      } catch (error) {
        assert(error)
      }
    })

    it(`should render the template with the given data`, async function () {
      this.timeout(5000)

      const templatePath = join(basePath, 'template.vue')
      const data = { myData: 'this is my data' }
      const { rendered, foot } = await Adapter.render(options, templatePath, data)
      const html = '<p data-server-rendered="true" data-v-5c9d4f22>this is my data</p>'

      assertMatches(rendered, html)
      assertMatches(foot, /<script/)
      assertMatches(foot, /<\/script>/)
    })
  })
})
