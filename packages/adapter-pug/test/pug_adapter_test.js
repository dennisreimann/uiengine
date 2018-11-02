const assert = require('assert')
const { resolve } = require('path')
const Adapter = require('../src/index')

const basePath = resolve(__dirname, 'fixtures')
const elementsPath = resolve(basePath, 'elements')
const modulesPath = resolve(basePath, 'modules')
const atomFilePath = resolve(elementsPath, 'atom/atom.pug')
const moleculeFilePath = resolve(modulesPath, 'molecule/molecule.pug')
const organismFilePath = resolve(modulesPath, 'organism/organism.pug')

const adapterOptions = {
  components: [elementsPath, modulesPath],
  basedir: basePath
}

describe('Pug adapter', () => {
  describe('#render', () => {
    it('should render the template with the given data', async () => {
      const templatePath = resolve(__dirname, 'fixtures', 'template.pug')
      const data = { myData: 1 }
      const rendered = await Adapter.render(adapterOptions, templatePath, data)

      assert.strictEqual(rendered, '<p>1</p>')
    })

    it('should throw error if the file does not exist', async () => {
      try {
        await Adapter.render({}, 'does-not-exist.pug')
      } catch (error) {
        assert(error)
      }
    })
  })

  describe('#registerComponentFile', () => {
    it('should extract the component dependencies and dependents', async () => {
      const { dependentFiles, dependencyFiles } = await Adapter.registerComponentFile(adapterOptions, moleculeFilePath)

      assert.strictEqual(dependencyFiles.length, 1)
      assert(dependencyFiles.includes(atomFilePath))

      assert.strictEqual(dependentFiles.length, 1)
      assert(dependentFiles.includes(organismFilePath))
    })

    it('should return undefined dependentFiles if there are no component dependents', async () => {
      const { dependentFiles } = await Adapter.registerComponentFile(adapterOptions, organismFilePath)

      assert.strictEqual(dependentFiles, undefined)
    })

    it('should return undefined dependencyFiles if there are no component dependents', async () => {
      const { dependencyFiles } = await Adapter.registerComponentFile(adapterOptions, atomFilePath)

      assert.strictEqual(dependencyFiles, undefined)
    })
  })

  describe('#filesForComponent', () => {
    it('should return the component file', () => {
      const files = Adapter.filesForComponent({}, 'button')

      assert.strictEqual(files.length, 1)
      assert.strictEqual(files[0].basename, 'button.pug')
    })
  })

  describe('#filesForVariant', () => {
    it('should return the variant file', () => {
      const files = Adapter.filesForVariant({}, 'button', 'primary')

      assert.strictEqual(files.length, 1)
      assert.strictEqual(files[0].basename, 'primary.pug')
    })
  })
})
