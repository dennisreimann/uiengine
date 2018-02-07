const assert = require('assert')
const { join, resolve } = require('path')

const { testProjectPath } = require('../../../test/support/paths')
const ComponentUtil = require('../src/util/component')

const componentsPath = resolve(testProjectPath, 'src', 'components')

describe('ComponentUtil', () => {
  describe('#componentIdToPath', () => {
    it('should return path for component', () => {
      assert.equal(
        ComponentUtil.componentIdToPath('button'),
        'components/button'
      )
    })
  })

  describe('#componentIdToComponentFilePath', () => {
    it('should return component file path for component', () => {
      assert.equal(
        ComponentUtil.componentIdToComponentFilePath(componentsPath, 'button'),
        join(componentsPath, 'button', 'component.md')
      )
    })
  })

  describe('#componentFilePathToComponentId', () => {
    it('should return component id for component file path', () => {
      const filePath = join(componentsPath, 'button', 'component.md')
      assert.equal(ComponentUtil.componentFilePathToComponentId(componentsPath, filePath), 'button')
    })

    it('should return component id for file path', () => {
      const filePath = join(componentsPath, 'button', 'additional.pdf')
      assert.equal(ComponentUtil.componentFilePathToComponentId(componentsPath, filePath), 'button')
    })

    it('should return component id for variant file path', () => {
      const filePath = join(componentsPath, 'button', 'variants', 'button.pug')
      assert.equal(ComponentUtil.componentFilePathToComponentId(componentsPath, filePath), 'button')
    })

    it('should return null for invalid file path', () => {
      const filePath = join(testProjectPath, 'src', 'uiengine', 'pages', 'page.md')
      assert.equal(ComponentUtil.componentFilePathToComponentId(componentsPath, filePath), null)
    })
  })

  describe('#componentPathToComponentId', () => {
    it('should return component id for component path', () => {
      const componentPath = join(componentsPath, 'button')
      assert.equal(ComponentUtil.componentPathToComponentId(componentsPath, componentPath), 'button')
    })

    it('should return null for invalid component id', () => {
      const filePath = join(testProjectPath, 'src', 'uiengine', 'pages', 'page.md')
      assert.equal(ComponentUtil.componentPathToComponentId(componentsPath, filePath), null)
    })
  })
})
