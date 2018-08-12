const assert = require('assert')
const { join, resolve } = require('path')

const VariantUtil = require('../src/variant')

const { testProjectPath } = require('../../../test/support/paths')
const elementsPath = resolve(testProjectPath, 'src', 'elements')
const modulesPath = resolve(testProjectPath, 'src', 'modules')
const componentPaths = [elementsPath, modulesPath]

describe('VariantUtil', () => {
  describe('#componentIdToVariantsPath', () => {
    it('should return variants path for component id', () => {
      assert.strictEqual(
        VariantUtil.componentIdToVariantsPath(componentPaths, 'form'),
        join(modulesPath, 'form', 'variants'))
    })
  })

  describe('#variantFilePathToIdPrefix', () => {
    it('should return variant id for variant file path', () => {
      const variantFilePath = join(elementsPath, 'input', 'variants', 'number.pug')
      const variantIdPrefix = VariantUtil.variantFilePathToIdPrefix(componentPaths, variantFilePath)
      assert.strictEqual(variantIdPrefix, 'input/number.pug')
    })

    it('should return undefined for invalid variant file path', () => {
      const variantFilePath = join(elementsPath, 'input', 'number.pug')
      const variantId = VariantUtil.variantFilePathToIdPrefix(componentPaths, variantFilePath)
      assert.strictEqual(variantId, undefined)
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
      const variantFilePath = join(elementsPath, 'input', 'variants', 'number.pug')
      const componentId = VariantUtil.variantFilePathToComponentId(componentPaths, variantFilePath)
      assert.strictEqual(componentId, 'input')
    })

    it('should return null for invalid variant file path', () => {
      const variantFilePath = join(elementsPath, 'input', 'number.pug')
      const variantId = VariantUtil.variantFilePathToComponentId(componentPaths, variantFilePath)
      assert.strictEqual(variantId, null)
    })
  })

  describe('#variantIdToComponentId', () => {
    it('should return component id for variant id', () => {
      assert.strictEqual(VariantUtil.variantIdToComponentId('input/number.pug-1'), 'input')
    })
  })

  describe('#variantIdToFilePath', () => {
    it('should return variant file path for variant id', () => {
      assert.strictEqual(
        VariantUtil.variantIdToFilePath(componentPaths, 'input/checkbox.pug-1'),
        join(elementsPath, 'input', 'variants', 'checkbox.pug')
      )
    })
  })
})
