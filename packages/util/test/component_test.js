const assert = require('assert')
const { join, resolve } = require('path')

const { testProjectPath } = require('../../../test/support/paths')
const ComponentUtil = require('../src/component')

const componentsPath = resolve(testProjectPath, 'src', 'components')

describe('ComponentUtil', () => {
  describe('#componentIdToPath', () => {
    it('should return path for component', () => {
      assert.equal(ComponentUtil.componentIdToPath('button'), 'components/button')
    })
  })

  describe('#componentIdToComponentFilePath', () => {
    it('should return component file path for component', () => {
      const filePath = ComponentUtil.componentIdToComponentFilePath(componentsPath, 'button')

      assert.equal(filePath, join(componentsPath, 'button', 'component.md'))
    })
  })

  describe('#componentFilePathToComponentId', () => {
    it('should return component id for component file path', () => {
      const filePath = join(componentsPath, 'button', 'component.md')
      const componentId = ComponentUtil.componentFilePathToComponentId(componentsPath, filePath)

      assert.equal(componentId, 'button')
    })

    it('should return component id for file path', () => {
      const filePath = join(componentsPath, 'button', 'additional.pdf')
      const componentId = ComponentUtil.componentFilePathToComponentId(componentsPath, filePath)

      assert.equal(componentId, 'button')
    })

    it('should return component id for variant file path', () => {
      const filePath = join(componentsPath, 'button', 'variants', 'button.pug')
      const componentId = ComponentUtil.componentFilePathToComponentId(componentsPath, filePath)

      assert.equal(componentId, 'button')
    })

    it('should return null for invalid file path', () => {
      const filePath = join(testProjectPath, 'src', 'uiengine', 'pages', 'page.md')
      const componentId = ComponentUtil.componentFilePathToComponentId(componentsPath, filePath)

      assert.equal(componentId, null)
    })
  })

  describe('#componentPathToComponentId', () => {
    it('should return component id for component path', () => {
      const componentPath = join(componentsPath, 'button')
      const componentId = ComponentUtil.componentPathToComponentId(componentsPath, componentPath)

      assert.equal(componentId, 'button')
    })

    it('should return null for invalid component id', () => {
      const filePath = join(testProjectPath, 'src', 'uiengine', 'pages', 'page.md')
      const componentId = ComponentUtil.componentPathToComponentId(componentsPath, filePath)

      assert.equal(componentId, null)
    })
  })
})
