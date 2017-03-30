/* global describe, it */
const path = require('path')
const assert = require('assert')

const VariantUtil = require('../src/util/variant')

const componentsPath = path.resolve(__dirname, 'project', 'src', 'components')

describe('VariantUtil', () => {
  describe('#componentIdToVariantsPath', () => {
    it('should return variants path for component id', () => {
      assert.equal(
        VariantUtil.componentIdToVariantsPath(componentsPath, 'button'),
        path.join(componentsPath, 'button', 'variants'))
    })
  })

  describe('#variantFilePathToVariantId', () => {
    it('should return variant id for variant file path', () => {
      const variantFilePath = path.join(componentsPath, 'button', 'variants', 'primary-button.pug')
      const variantId = VariantUtil.variantFilePathToVariantId(componentsPath, variantFilePath)
      assert.equal(variantId, 'button/primary-button.pug')
    })

    it('should return null for invalid variant file path', () => {
      const variantFilePath = path.join(componentsPath, 'button', 'button.pug')
      const variantId = VariantUtil.variantFilePathToVariantId(componentsPath, variantFilePath)
      assert.equal(variantId, null)
    })
  })

  describe('#variantIdToTitle', () => {
    it('should return titleized name', () => {
      assert.equal(VariantUtil.variantIdToTitle('form/form.pug'), 'Form')
      assert.equal(VariantUtil.variantIdToTitle('formrow/formrow-with-label.pug'), 'Formrow With Label')
    })
  })

  describe('#variantFilePathToComponentId', () => {
    it('should return component id for variant file path', () => {
      const variantFilePath = path.join(componentsPath, 'button', 'variants', 'primary-button.pug')
      const componentId = VariantUtil.variantFilePathToComponentId(componentsPath, variantFilePath)
      assert.equal(componentId, 'button')
    })

    it('should return null for invalid variant file path', () => {
      const variantFilePath = path.join(componentsPath, 'button', 'button.pug')
      const variantId = VariantUtil.variantFilePathToComponentId(componentsPath, variantFilePath)
      assert.equal(variantId, null)
    })
  })

  describe('#variantIdToComponentId', () => {
    it('should return component id for variant id', () => {
      assert.equal(VariantUtil.variantIdToComponentId('button/primary-button.pug'), 'button')
    })
  })

  describe('#variantIdToVariantFilePath', () => {
    it('should return variant file path for variant id', () => {
      assert.equal(
        VariantUtil.variantIdToVariantFilePath(componentsPath, 'input/checkbox.pug'),
        path.join(componentsPath, 'input', 'variants', 'checkbox.pug')
      )
    })
  })
})
