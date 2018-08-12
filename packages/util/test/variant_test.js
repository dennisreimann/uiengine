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

  describe('#variantFilePathToIdPrefix', () => {
    it('should return variant id for variant file path', () => {
      const variantFilePath = join(componentsPath, 'button', 'variants', 'primary-button.pug')
      const variantIdPrefix = VariantUtil.variantFilePathToIdPrefix(componentsPath, variantFilePath)
      assert.strictEqual(variantIdPrefix, 'button/primary-button.pug')
    })

    it('should return null for invalid variant file path', () => {
      const variantFilePath = join(componentsPath, 'button', 'button.pug')
      const variantId = VariantUtil.variantFilePathToIdPrefix(componentsPath, variantFilePath)
      assert.strictEqual(variantId, null)
    })
  })

  describe('#variantIdToTitle', () => {
    it('should return titleized name', () => {
      assert.strictEqual(VariantUtil.variantIdToTitle('form/form.pug-1'), 'Form')
      assert.strictEqual(VariantUtil.variantIdToTitle('formfield/formfield-with-label.pug-1'), 'Formfield With Label')
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
      assert.strictEqual(VariantUtil.variantIdToComponentId('button/primary-button.pug-1'), 'button')
    })
  })

  describe('#variantIdToFilePath', () => {
    it('should return variant file path for variant id', () => {
      assert.strictEqual(
        VariantUtil.variantIdToFilePath(componentsPath, 'input/checkbox.pug-1'),
        join(componentsPath, 'input', 'variants', 'checkbox.pug')
      )
    })
  })
})
