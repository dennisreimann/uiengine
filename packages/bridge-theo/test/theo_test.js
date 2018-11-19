const assert = require('assert')
const convert = require('../src/index')
const { resolve } = require('path')

const colorsFile = resolve(__dirname, 'fixtures', 'colors.yml')

describe('Theo bridge', function () {
  describe('without modfiy function', () => {
    it('should convert tokens', async () => {
      const result = convert(colorsFile)

      assert.strictEqual(result.length, 2)

      const [brand, neutral] = result

      // categories
      assert.strictEqual(brand.type, 'category')
      assert.strictEqual(brand.name, 'Brand')
      assert.strictEqual(brand.tokens.length, 2)

      assert.strictEqual(neutral.type, 'category')
      assert.strictEqual(neutral.name, 'Neutral')
      assert.strictEqual(neutral.tokens.length, 2)

      // tokens
      const [colorBrandPrimary, colorBrandSecondary] = brand.tokens
      const [colorNeutralWhite, colorNeutralBlack] = neutral.tokens

      assert.strictEqual(colorBrandPrimary.type, 'color')
      assert.strictEqual(colorBrandPrimary.name, 'colorBrandPrimary')
      assert.strictEqual(colorBrandPrimary.value, '#FF183E')
      assert.strictEqual(colorBrandPrimary.reference, null)
      assert.strictEqual(colorBrandPrimary.variable, undefined)

      assert.strictEqual(colorBrandSecondary.type, 'color')
      assert.strictEqual(colorBrandSecondary.name, 'colorBrandSecondary')
      assert.strictEqual(colorBrandSecondary.value, '#331833')
      assert.strictEqual(colorBrandSecondary.reference, null)
      assert.strictEqual(colorBrandSecondary.variable, undefined)

      assert.strictEqual(colorNeutralWhite.type, 'color')
      assert.strictEqual(colorNeutralWhite.name, 'colorNeutralWhite')
      assert.strictEqual(colorNeutralWhite.value, '#FFF')
      assert.strictEqual(colorNeutralWhite.reference, 'colorNeutral100')
      assert.strictEqual(colorNeutralWhite.variable, undefined)

      assert.strictEqual(colorNeutralBlack.type, 'color')
      assert.strictEqual(colorNeutralBlack.name, 'colorNeutralBlack')
      assert.strictEqual(colorNeutralBlack.value, '#000')
      assert.strictEqual(colorNeutralBlack.reference, 'colorNeutral0')
      assert.strictEqual(colorNeutralBlack.variable, undefined)
    })
  })

  describe('with modify function', () => {
    it('should convert tokens', async () => {
      const titleize = string => string.replace(/([A-Z\d]+)/g, ' $1').replace(/^./, str => str.toUpperCase()).replace(/^Color /, '')
      const variablize = string => `$${string.replace(/([a-z])([A-Z\d]+)/g, '$1-$2').replace(/\s+/g, '-').toLowerCase()}`
      const modify = prop => {
        const { name, reference } = prop
        prop.name = titleize(name)
        prop.variable = variablize(name)
        if (reference) prop.reference = titleize(reference)
        return prop
      }

      const result = convert(colorsFile, modify)

      const [brand, neutral] = result
      const [colorBrandPrimary, colorBrandSecondary] = brand.tokens
      const [colorNeutralWhite, colorNeutralBlack] = neutral.tokens

      assert.strictEqual(colorBrandPrimary.name, 'Brand Primary')
      assert.strictEqual(colorBrandPrimary.variable, '$color-brand-primary')

      assert.strictEqual(colorBrandSecondary.name, 'Brand Secondary')
      assert.strictEqual(colorBrandSecondary.variable, '$color-brand-secondary')

      assert.strictEqual(colorNeutralWhite.name, 'Neutral White')
      assert.strictEqual(colorNeutralWhite.reference, 'Neutral 100')
      assert.strictEqual(colorNeutralWhite.variable, '$color-neutral-white')

      assert.strictEqual(colorNeutralBlack.name, 'Neutral Black')
      assert.strictEqual(colorNeutralBlack.reference, 'Neutral 0')
      assert.strictEqual(colorNeutralBlack.variable, '$color-neutral-black')
    })
  })
})
