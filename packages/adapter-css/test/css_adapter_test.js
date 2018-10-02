const assert = require('assert')
const { resolve } = require('path')
const Adapter = require('../src/index')

const adapterOptions = {}

describe('CSS adapter', () => {
  describe('#registerComponentFile', () => {
    it('should extract the component themeProperties', async () => {
      const filePath = resolve(__dirname, 'fixtures', 'button.css')
      const { themeProperties } = await Adapter.registerComponentFile(adapterOptions, filePath)

      assert(themeProperties)
    })

    it('should return undefined themeProperties if there are no component theme properties', async () => {
      const filePath = resolve(__dirname, 'fixtures', 'paragraph.css')
      const { themeProperties } = await Adapter.registerComponentFile(adapterOptions, filePath)

      assert.strictEqual(themeProperties, undefined)
    })
  })

  describe('#filesForComponent', () => {
    it('should return the component file', () => {
      const files = Adapter.filesForComponent('button')

      assert.strictEqual(files.length, 1)
      assert.strictEqual(files[0].basename, 'button.css')
    })
  })
})
