require('mocha-sinon')()

const assert = require('assert')
const { join } = require('path')
const { StringUtil: { crossPlatformPath } } = require('@uiengine/util')
const { assertMatches, assertIncludes } = require('../../../test/support/asserts')

const Adapter = require('../src/index')

const basePath = join(__dirname, 'fixtures/vue')
const elementsPath = join(basePath, 'elements')
const modulesPath = join(basePath, 'modules')
const atomFilePath = join(elementsPath, 'Atom', 'index.vue')
const moleculeFilePath = join(modulesPath, 'Molecule', 'Molecule.vue')
const moleculeIndexPath = join(modulesPath, 'Molecule', 'index.js')
const moleculeVariantPath = join(modulesPath, 'Molecule', 'variants', 'Molecule.vue')
const organismFilePath = join(modulesPath, 'Organism', 'index.vue')
const organismVariantPath = join(modulesPath, 'Organism', 'variants', 'Organism.vue')
const templatePath = join(basePath, 'template.vue')
const componentNormalizerPath = require.resolve('vue-loader/lib/runtime/componentNormalizer.js')

const options = {
  ...require(join(basePath, 'adapter_options')),
  components: [elementsPath, modulesPath]
}

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
      const css = 'p[data-v-5c9d4f22] { font-size: 2rem;'

      assertMatches(rendered, html)
      assertMatches(rendered, css)
      assertMatches(foot, /<script/)
      assertMatches(foot, /<\/script>/)
    })
  })

  describe('#registerComponentFile', () => {
    it('should extract the component dependencies and dependents', async () => {
      const { dependentFiles, dependencyFiles } = await Adapter.registerComponentFile(options, moleculeFilePath)

      assert.strictEqual(dependencyFiles.length, 2, JSON.stringify(dependencyFiles, null, 2))
      assertIncludes(dependencyFiles, crossPlatformPath(componentNormalizerPath))
      assertIncludes(dependencyFiles, crossPlatformPath(atomFilePath))

      assert.strictEqual(dependentFiles.length, 4, JSON.stringify(dependentFiles, null, 2))
      assertIncludes(dependentFiles, crossPlatformPath(moleculeIndexPath))
      assertIncludes(dependentFiles, crossPlatformPath(moleculeVariantPath))
      assertIncludes(dependentFiles, crossPlatformPath(organismFilePath))
      assertIncludes(dependentFiles, crossPlatformPath(organismVariantPath))
    })

    it('should return undefined dependentFiles if there are no component dependents', async () => {
      const { dependentFiles } = await Adapter.registerComponentFile(options, templatePath)

      assert.strictEqual(dependentFiles, undefined)
    })

    // it('should return undefined dependencyFiles if there are no component dependents', async () => {
    //   const { dependencyFiles } = await Adapter.registerComponentFile(options, atomFilePath)

    //   assert.strictEqual(dependencyFiles, undefined)
    // })
  })
})
