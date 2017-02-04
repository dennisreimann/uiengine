/* global describe, it */
const path = require('path')
const assert = require('assert')

const VariationUtil = require('../lib/util/variation')

const componentsPath = path.resolve(__dirname, '../sample_project/src/components')

describe('VariationUtil', () => {
  describe('#componentIdToVariationsPath', () => {
    it('should return variations path for component id', () => {
      assert.equal(
        VariationUtil.componentIdToVariationsPath(componentsPath, 'button'),
        path.join(componentsPath, 'button', 'variations'))
    })
  })

  describe('#variationIdFromVariationFilePath', () => {
    it('should return variation id for variation file path', () => {
      const variationFilePath = path.join(componentsPath, 'button', 'variations', 'primary-button.pug')
      const variationId = VariationUtil.variationIdFromVariationFilePath(componentsPath, variationFilePath)
      assert.equal(variationId, 'button/primary-button')
    })
  })

  describe('#componentIdFromVariationFilePath', () => {
    it('should return component id for variation file path', () => {
      const variationFilePath = path.join(componentsPath, 'button', 'variations', 'primary-button.pug')
      const componentId = VariationUtil.componentIdFromVariationFilePath(componentsPath, variationFilePath)
      assert.equal(componentId, 'button')
    })
  })

  describe('#componentIdFromVariationId', () => {
    it('should return variation id for variation file path', () => {
      const componentId = VariationUtil.componentIdFromVariationId('button/primary-button')
      assert.equal(componentId, 'button')
    })
  })

  describe('#variationIdToVariationFilePath', () => {
    it('should return component id for variation file path', () => {
      assert.equal(
        VariationUtil.variationIdToVariationFilePath(componentsPath, 'input/checkbox'),
        path.join(componentsPath, 'input', 'variations', 'checkbox.pug')
      )
    })
  })
})
