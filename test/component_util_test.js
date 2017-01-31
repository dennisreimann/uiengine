/* global describe, it */
const assert = require('assert')

const ComponentUtil = require('../lib/util/component')

const componentsPath = './components'

describe('ComponentUtil', () => {
  describe('#componentIdToPath', () => {
    it('should return path for component', () => {
      assert.equal(ComponentUtil.componentIdToPath(componentsPath, 'button'), 'components/button')
    })
  })

  describe('#componentIdToComponentFilePath', () => {
    it('should return component file path for component', () => {
      assert.equal(ComponentUtil.componentIdToComponentFilePath(componentsPath, 'button'), 'components/button/component.md')
    })
  })

  describe('#componentFilePathToComponentId', () => {
    it('should return component id for component file path', () => {
      assert.equal(ComponentUtil.componentFilePathToComponentId(componentsPath, './components/button/component.md'), 'button')
    })

    it('should return component id for file path', () => {
      assert.equal(ComponentUtil.componentFilePathToComponentId(componentsPath, './components/button/additional.pdf'), 'button')
    })
  })

  describe('#componentIdToVariationsPath', () => {
    it('should return variations path for component id', () => {
      assert.equal(ComponentUtil.componentIdToVariationsPath(componentsPath, 'button'), 'components/button/variations')
    })
  })

  describe('#variationIdFromVariationFilePath', () => {
    it('should return variation id for variation file path', () => {
      const variationId = ComponentUtil.variationIdFromVariationFilePath(componentsPath, 'button', './components/button/variations/primary-button.pug')
      assert.equal(variationId, 'button/primary-button')
    })
  })
})
