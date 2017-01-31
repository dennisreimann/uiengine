/* global describe, it */
const assert = require('assert')

const VariationUtil = require('../lib/util/variation')

const componentsPath = './components'

describe('VariationUtil', () => {
  describe('#componentIdToVariationsPath', () => {
    it('should return variations path for component id', () => {
      assert.equal(VariationUtil.componentIdToVariationsPath(componentsPath, 'button'), 'components/button/variations')
    })
  })

  describe('#variationIdFromVariationFilePath', () => {
    it('should return variation id for variation file path', () => {
      const variationId = VariationUtil.variationIdFromVariationFilePath(componentsPath, 'button', './components/button/variations/primary-button.pug')
      assert.equal(variationId, 'button/primary-button')
    })
  })
})
