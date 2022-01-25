require('mocha-sinon')()

const assert = require('assert')
const { join } = require('path')
const { StringUtil: { crossPlatformPath }, FileUtil: { removeSync } } = require('@uiengine/util')
const { assertMatches, assertIncludes } = require('../../../test/support/asserts')
const { testProjectTargetPath } = require('../../../test/support/paths')

const Adapter = require('../src/index')

const basePath = join(__dirname, 'fixtures/vue')
const elementsPath = join(basePath, 'elements')
const modulesPath = join(basePath, 'modules')
const atomFilePath = join(elementsPath, 'Atom', 'index.vue')
const moleculeFilePath = join(modulesPath, 'Molecule', 'Molecule.vue')
const moleculeIndexPath = join(modulesPath, 'Molecule', 'index.vue')
const organismFilePath = join(modulesPath, 'Organism', 'index.vue')
const templatePath = join(basePath, 'template.vue')
const outputPath = join(testProjectTargetPath, '_webpack')

const options = {
  ...require(join(basePath, 'adapter_options')),
  components: [elementsPath, modulesPath],
  target: testProjectTargetPath,
  ext: 'vue',
  uiBase: '/'
}

describe('Webpack adapter with Vue templates', function () {
  this.timeout(5000)

  afterEach(function () {
    removeSync(outputPath)
    this.sinon.restore()
  })

  describe('#setup', () => {
    it('should warn if config is incorrect', async function () {
      this.sinon.stub(console, 'warn')

      let incorrectOptions

      incorrectOptions = Object.assign({}, options)
      delete incorrectOptions.serverRenderPath
      delete incorrectOptions.clientRenderPath

      await Adapter.setup(incorrectOptions)

      this.sinon.assert.calledWith(console.warn, 'Webpack: Please specify both serverConfig and serverRenderPath')
      this.sinon.assert.calledWith(console.warn, 'Webpack: Please specify both clientConfig and clientRenderPath')

      incorrectOptions = Object.assign({}, options)
      delete incorrectOptions.serverConfig
      delete incorrectOptions.clientConfig

      await Adapter.setup(incorrectOptions)

      this.sinon.assert.calledWith(console.warn, 'Webpack: Please specify both serverConfig and serverRenderPath')
      this.sinon.assert.calledWith(console.warn, 'Webpack: Please specify both clientConfig and clientRenderPath')
    })
  })

  describe('#render', () => {
    before(async () => { await Adapter.setup(options) })

    it('should throw error if the file does not exist', async function () {
      this.sinon.stub(console, 'error')

      try {
        await Adapter.render(options, 'does-not-exist.vue')
      } catch (error) {
        assert(error)
      }
    })

    it('should render the template with the given data', async () => {
      const templatePath = join(basePath, 'template.vue')
      const data = { myData: 'this is my data' }
      const { rendered, foot } = await Adapter.render(options, templatePath, data, 'test-template')
      const html = '<p data-server-rendered="true" data-v-5c9d4f22>this is my data</p>'
      const css = 'p[data-v-5c9d4f22] { font-size: 2rem;'

      assertMatches(rendered, html)
      assertMatches(rendered, css)
      assertMatches(foot, '<script src="/_webpack/test_template_client.js"></script>')
    })
  })

  describe('#registerComponentFile', () => {
    it('should extract the component dependencies and dependents', async () => {
      // simulate build by invoking registerComponentFile on all files
      const [{ dependentFiles, dependencyFiles }] = await Promise.all([
        // file under test
        Adapter.registerComponentFile(options, moleculeFilePath),
        // other related files
        Adapter.registerComponentFile(options, moleculeIndexPath),
        Adapter.registerComponentFile(options, atomFilePath),
        Adapter.registerComponentFile(options, organismFilePath),
        Adapter.registerComponentFile(options, templatePath)
      ])

      assert.strictEqual(dependencyFiles.length, 1, `Count of dependencyFiles does not match: ${JSON.stringify(dependencyFiles, null, 2)}`)
      assertIncludes(dependencyFiles, crossPlatformPath(atomFilePath))

      assert.strictEqual(dependentFiles.length, 2, `Count of dependentFiles does not match: ${JSON.stringify(dependentFiles, null, 2)}`)
      assertIncludes(dependentFiles, crossPlatformPath(moleculeIndexPath))
      assertIncludes(dependentFiles, crossPlatformPath(organismFilePath))
    })

    it('should return undefined dependentFiles if there are no component dependents', async () => {
      const { dependentFiles } = await Adapter.registerComponentFile(options, templatePath)

      assert.strictEqual(dependentFiles, undefined)
    })

    it('should extract the component properties', async () => {
      const componentPath = join(basePath, 'props-full.vue')
      const { properties } = await Adapter.registerComponentFile(options, componentPath)
      assert(properties)

      const props = properties['<FullProps>']

      assert.strictEqual(typeof props, 'object')
      assert.strictEqual(typeof props.id, 'object')
      assert.strictEqual(props.id.type, 'Number')
      assert.strictEqual(props.id.required, true)

      assert.strictEqual(typeof props.title, 'object')
      assert.strictEqual(props.title.type, 'String')
      assert.strictEqual(props.title.default, 'This is the default title')
      assert.strictEqual(props.title.description, 'An optional description')
    })

    it('should return undefined properties if there are no component properties', async () => {
      const componentPath = join(basePath, 'props-undefined.vue')
      const { properties } = await Adapter.registerComponentFile(options, componentPath)
      assert.strictEqual(properties, undefined)
    })

    it('should return basic properties if props is an array', async () => {
      const componentPath = join(basePath, 'props-array.vue')
      const { properties } = await Adapter.registerComponentFile(options, componentPath)
      assert(properties)

      const props = properties['<ArrayProps>']

      assert.strictEqual(typeof props, 'object')
      assert.strictEqual(typeof props.id, 'object')
      assert.strictEqual(typeof props.title, 'object')
    })

    it('should return basic properties if props is a object with types', async () => {
      const componentPath = join(basePath, 'props-typed.vue')
      const { properties } = await Adapter.registerComponentFile(options, componentPath)
      assert(properties)

      const props = properties['<TypedProps>']

      assert.strictEqual(typeof props, 'object')
      assert.strictEqual(typeof props.id, 'object')
      assert.strictEqual(props.id.type, 'Number')

      assert.strictEqual(typeof props.title, 'object')
      assert.strictEqual(props.title.type, 'String')
    })
  })

  describe('#filesForComponent', () => {
    it('should return the component file', () => {
      const files = Adapter.filesForComponent(options, 'button')

      assert.strictEqual(files.length, 2)
      assert.strictEqual(files[0].basename, 'Button.vue')

      const content = files[0].data

      assertMatches(content, '<div class="button">')
      assertMatches(content, 'export default {')
      assertMatches(content, '.button {')

      const index = files[1].data

      assertMatches(index, "import Button from './Button.vue'")
      assertMatches(index, 'export default Button')
    })
  })

  describe('#filesForVariant', () => {
    it('should return the variant file', () => {
      const files = Adapter.filesForVariant(options, 'button', 'primary')

      assert.strictEqual(files.length, 1)
      assert.strictEqual(files[0].basename, 'Primary.vue')

      const content = files[0].data

      assertMatches(content, "import Button from '../Button.vue'")
      assertMatches(content, 'props: Button.props')
      assertMatches(content, '<Button v-bind="$props" />')
    })
  })
})
