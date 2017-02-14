/* global describe, it */
const path = require('path')
const assert = require('assert')

const VariationUtil = require('../src/util/variation')

const componentsPath = path.resolve(__dirname, '..', 'sample_project', 'src', 'components')

describe('VariationUtil', () => {
  describe('#componentIdToVariationsPath', () => {
    it('should return variations path for component id', () => {
      assert.equal(
        VariationUtil.componentIdToVariationsPath(componentsPath, 'button'),
        path.join(componentsPath, 'button', 'variations'))
    })
  })

  describe('#variationFilePathToVariationId', () => {
    it('should return variation id for variation file path', () => {
      const variationFilePath = path.join(componentsPath, 'button', 'variations', 'primary-button.pug')
      const variationId = VariationUtil.variationFilePathToVariationId(componentsPath, variationFilePath)
      assert.equal(variationId, 'button/primary-button.pug')
    })

    it('should return null for invalid variation file path', () => {
      const variationFilePath = path.join(componentsPath, 'button', 'button.pug')
      const variationId = VariationUtil.variationFilePathToVariationId(componentsPath, variationFilePath)
      assert.equal(variationId, null)
    })
  })

  describe('#variationIdToTitle', () => {
    it('should return titleized name', () => {
      assert.equal(VariationUtil.variationIdToTitle('form/form.pug'), 'Form')
      assert.equal(VariationUtil.variationIdToTitle('formrow/formrow-with-label.pug'), 'Formrow With Label')
    })
  })

  describe('#variationFilePathToComponentId', () => {
    it('should return component id for variation file path', () => {
      const variationFilePath = path.join(componentsPath, 'button', 'variations', 'primary-button.pug')
      const componentId = VariationUtil.variationFilePathToComponentId(componentsPath, variationFilePath)
      assert.equal(componentId, 'button')
    })

    it('should return null for invalid variation file path', () => {
      const variationFilePath = path.join(componentsPath, 'button', 'button.pug')
      const variationId = VariationUtil.variationFilePathToComponentId(componentsPath, variationFilePath)
      assert.equal(variationId, null)
    })
  })

  describe('#variationIdToComponentId', () => {
    it('should return component id for variation id', () => {
      assert.equal(VariationUtil.variationIdToComponentId('button/primary-button.pug'), 'button')
    })
  })

  describe('#variationIdToVariationFilePath', () => {
    it('should return variation file path for variation id', () => {
      assert.equal(
        VariationUtil.variationIdToVariationFilePath(componentsPath, 'input/checkbox.pug'),
        path.join(componentsPath, 'input', 'variations', 'checkbox.pug')
      )
    })
  })
})
