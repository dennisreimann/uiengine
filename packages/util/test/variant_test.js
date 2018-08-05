const assert = require('assert')
const { join, resolve } = require('path')

const VariantUtil = require('../src/variant')

const { testProjectPath } = require('../../../test/support/paths')
const componentsPath = resolve(testProjectPath, 'src', 'components')

describe('VariantUtil', () => {
  describe('#componentIdToVariantsPath', () => {
    it('should return variants path for component id', () => {
      assert.strictEqual(
        VariantUtil.componentIdToVariantsPath(componentsPath, 'button'),
        join(componentsPath, 'button', 'variants'))
    })
  })

  describe('#variantFilePathToVariantId', () => {
    it('should return variant id for variant file path', () => {
      const variantFilePath = join(componentsPath, 'button', 'variants', 'primary-button.pug')
      const variantId = VariantUtil.variantFilePathToVariantId(componentsPath, variantFilePath)
      assert.strictEqual(variantId, 'button/primary-button.pug')
    })

    it('should return null for invalid variant file path', () => {
      const variantFilePath = join(componentsPath, 'button', 'button.pug')
      const variantId = VariantUtil.variantFilePathToVariantId(componentsPath, variantFilePath)
      assert.strictEqual(variantId, null)
    })
  })

  describe('#variantIdToTitle', () => {
    it('should return titleized name', () => {
      assert.strictEqual(VariantUtil.variantIdToTitle('form/form.pug'), 'Form')
      assert.strictEqual(VariantUtil.variantIdToTitle('formfield/formfield-with-label.pug'), 'Formfield With Label')
    })
  })

  describe('#variantFilePathToComponentId', () => {
    it('should return component id for variant file path', () => {
      const variantFilePath = join(componentsPath, 'button', 'variants', 'primary-button.pug')
      const componentId = VariantUtil.variantFilePathToComponentId(componentsPath, variantFilePath)
      assert.strictEqual(componentId, 'button')
    })

    it('should return null for invalid variant file path', () => {
      const variantFilePath = join(componentsPath, 'button', 'button.pug')
      const variantId = VariantUtil.variantFilePathToComponentId(componentsPath, variantFilePath)
      assert.strictEqual(variantId, null)
    })
  })

  describe('#variantIdToComponentId', () => {
    it('should return component id for variant id', () => {
      assert.strictEqual(VariantUtil.variantIdToComponentId('button/primary-button.pug'), 'button')
    })
  })

  describe('#variantIdToVariantFilePath', () => {
    it('should return variant file path for variant id', () => {
      assert.strictEqual(
        VariantUtil.variantIdToVariantFilePath(componentsPath, 'input/checkbox.pug'),
        join(componentsPath, 'input', 'variants', 'checkbox.pug')
      )
    })
  })
})
