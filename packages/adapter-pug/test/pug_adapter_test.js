const assert = require('assert')
const { join, resolve } = require('path')
const { StringUtil: { crossPlatformPath } } = require('@uiengine/util')

const Adapter = require('../src/index')

const basePath = join(__dirname, 'fixtures')
const elementsPath = join(basePath, 'elements')
const modulesPath = join(basePath, 'modules')
const atomFilePath = join(elementsPath, 'atom', 'atom.pug')
const moleculeFilePath = join(modulesPath, 'molecule', 'molecule.pug')
const moleculeVariantPath = join(modulesPath, 'molecule', 'variants', 'molecule.pug')
const organismFilePath = join(modulesPath, 'organism', 'organism.pug')
const organismVariantPath = join(modulesPath, 'organism', 'variants', 'organism.pug')
const templatePath = resolve(basePath, 'template.pug')

const adapterOptions = {
  components: [elementsPath, modulesPath],
  basedir: basePath
}

describe('Pug adapter', () => {
  describe('#render', () => {
    it('should render the template with the given data', async () => {
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
      assert(dependencyFiles.includes(crossPlatformPath(atomFilePath)))

      assert.strictEqual(dependentFiles.length, 3)
      assert(dependentFiles.includes(crossPlatformPath(moleculeVariantPath)))
      assert(dependentFiles.includes(crossPlatformPath(organismFilePath)))
      assert(dependentFiles.includes(crossPlatformPath(organismVariantPath)))
    })

    it('should return undefined dependentFiles if there are no component dependents', async () => {
      const { dependentFiles } = await Adapter.registerComponentFile(adapterOptions, templatePath)

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
