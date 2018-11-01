const assert = require('assert')
const { assertMatches } = require('../../../test/support/asserts')
const { resolve } = require('path')
const Adapter = require('../src/index')

const adapterOptions = {
  themesDir: 'themes',
  themes: [
    {
      id: 'plain',
      title: 'Plain and simple'
    },
    {
      id: 'funky',
      title: 'Bright colors'
    }
  ]
}
const appPath = resolve(__dirname, 'fixtures', 'app.css')
const buttonPath = resolve(__dirname, 'fixtures', 'button', 'button.css')

describe('CSS adapter', () => {
  describe('#registerComponentFile', () => {
    it('should extract the component themeProperties (app)', async () => {
      const { themeProperties } = await Adapter.registerComponentFile(adapterOptions, appPath)

      assert(themeProperties)
      assert.strictEqual(themeProperties.length, 3)

      const [darkColor, textColor, backgroundColor] = themeProperties

      assert.strictEqual(darkColor.variable, '--dark-color')
      assert.strictEqual(darkColor.name, 'Dark Color')
      assert.strictEqual(darkColor.type, 'color')
      assert.strictEqual(darkColor.default.value, 'black')
      assert.strictEqual(Object.keys(darkColor.themes).length, 0)

      assert.strictEqual(textColor.variable, '--text-color')
      assert.strictEqual(textColor.name, 'Text Color')
      assert.strictEqual(textColor.type, 'color')
      assert.strictEqual(textColor.default.variable, '--dark-color')
      assert.strictEqual(textColor.default.value, 'black')
      assert.strictEqual(Object.keys(textColor.themes).length, 1)
      assert(textColor.themes.funky)
      assert.strictEqual(textColor.themes.funky.value, 'magenta')

      assert.strictEqual(backgroundColor.variable, '--background-color')
      assert.strictEqual(backgroundColor.name, 'Background Color')
      assert.strictEqual(backgroundColor.type, 'color')
      assert.strictEqual(backgroundColor.default.value, 'white')
      assert.strictEqual(Object.keys(backgroundColor.themes).length, 1)
      assert(backgroundColor.themes.funky)
      assert.strictEqual(backgroundColor.themes.funky.value, 'pink')
    })

    it('should extract the component themeProperties (button)', async () => {
      const { themeProperties } = await Adapter.registerComponentFile(adapterOptions, buttonPath)

      assert(themeProperties)
      assert.strictEqual(themeProperties.length, 2)

      const [textColor, backgroundColor] = themeProperties

      assert.strictEqual(textColor.variable, '--button-text-color')
      assert.strictEqual(textColor.name, 'Button Text Color')
      assert.strictEqual(textColor.type, 'color')
      assert.strictEqual(textColor.default.variable, '--text-color')
      assert.strictEqual(textColor.default.value, undefined)
      assert.strictEqual(Object.keys(textColor.themes).length, 2)
      assert(textColor.themes.funky)
      assert(textColor.themes.plain)
      assert.strictEqual(textColor.themes.funky.value, 'blue')
      assert.strictEqual(textColor.themes.plain.value, 'white')

      assert.strictEqual(backgroundColor.variable, '--button-background-color')
      assert.strictEqual(backgroundColor.name, 'Button Background Color')
      assert.strictEqual(backgroundColor.type, 'color')
      assert.strictEqual(backgroundColor.default.variable, '--background-color')
      assert.strictEqual(backgroundColor.default.value, undefined)
      assert.strictEqual(Object.keys(backgroundColor.themes).length, 2)
      assert(backgroundColor.themes.funky)
      assert(backgroundColor.themes.plain)
      assert.strictEqual(backgroundColor.themes.funky.value, 'yellow')
      assert.strictEqual(backgroundColor.themes.funky.variable, '--funky-background-color')
      assert.strictEqual(backgroundColor.themes.plain.value, undefined)
      assert.strictEqual(backgroundColor.themes.plain.variable, '--background-color')
    })

    it('should return undefined themeProperties if there are no component theme properties', async () => {
      const paragraphPath = resolve(__dirname, 'fixtures', 'paragraph.css')
      const { themeProperties } = await Adapter.registerComponentFile(adapterOptions, paragraphPath)

      assert.strictEqual(themeProperties, undefined)
    })
  })

  describe('#filesForComponent', () => {
    it('should return the component file', () => {
      const files = Adapter.filesForComponent('button')

      assert.strictEqual(files.length, 1)
      assert.strictEqual(files[0].basename, 'button.css')
      assertMatches(files[0].data, '.button {')
    })
  })
})
