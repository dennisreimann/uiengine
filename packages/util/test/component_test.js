const assert = require('assert')
const { join, resolve } = require('path')

const { testProjectPath } = require('../../../test/support/paths')
const ComponentUtil = require('../src/component')

const componentsPath = resolve(testProjectPath, 'src', 'components')

describe('ComponentUtil', () => {
  describe('#componentIdToPath', () => {
    it('should return path for component', () => {
      assert.strictEqual(ComponentUtil.componentIdToPath('button'), 'components/button')
    })
  })

  describe('#componentIdToFilePath', () => {
    it('should return component file path for component', () => {
      const filePath = ComponentUtil.componentIdToFilePath(componentsPath, 'button')

      assert.strictEqual(filePath, join(componentsPath, 'button', 'component.md'))
    })
  })

  describe('#componentFilePathToId', () => {
    it('should return component id for component file path', () => {
      const filePath = join(componentsPath, 'button', 'component.md')
      const componentId = ComponentUtil.componentFilePathToId(componentsPath, filePath)

      assert.strictEqual(componentId, 'button')
    })

    it('should return component id for file path', () => {
      const filePath = join(componentsPath, 'button', 'additional.pdf')
      const componentId = ComponentUtil.componentFilePathToId(componentsPath, filePath)

      assert.strictEqual(componentId, 'button')
    })

    it('should return component id for variant file path', () => {
      const filePath = join(componentsPath, 'button', 'variants', 'button.pug')
      const componentId = ComponentUtil.componentFilePathToId(componentsPath, filePath)

      assert.strictEqual(componentId, 'button')
    })

    it('should return null for invalid file path', () => {
      const filePath = join(testProjectPath, 'src', 'uiengine', 'pages', 'page.md')
      const componentId = ComponentUtil.componentFilePathToId(componentsPath, filePath)

      assert.strictEqual(componentId, null)
    })
  })

  describe('#componentPathToId', () => {
    it('should return component id for component path', () => {
      const componentPath = join(componentsPath, 'button')
      const componentId = ComponentUtil.componentPathToId(componentsPath, componentPath)

      assert.strictEqual(componentId, 'button')
    })

    it('should return null for invalid component id', () => {
      const filePath = join(testProjectPath, 'src', 'uiengine', 'pages', 'page.md')
      const componentId = ComponentUtil.componentPathToId(componentsPath, filePath)

      assert.strictEqual(componentId, null)
    })
  })
})
