const path = require('path')
const assert = require('assert')

const { testProjectPath } = require('./support/paths')
const ComponentUtil = require('../src/util/component')

const componentsPath = path.resolve(testProjectPath, 'src', 'components')

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
        path.join(componentsPath, 'button', 'component.md')
      )
    })
  })

  describe('#componentFilePathToComponentId', () => {
    it('should return component id for component file path', () => {
      const filePath = path.join(componentsPath, 'button', 'component.md')
      assert.equal(ComponentUtil.componentFilePathToComponentId(componentsPath, filePath), 'button')
    })

    it('should return component id for file path', () => {
      const filePath = path.join(componentsPath, 'button', 'additional.pdf')
      assert.equal(ComponentUtil.componentFilePathToComponentId(componentsPath, filePath), 'button')
    })

    it('should return component id for variant file path', () => {
      const filePath = path.join(componentsPath, 'button', 'variants', 'button.pug')
      assert.equal(ComponentUtil.componentFilePathToComponentId(componentsPath, filePath), 'button')
    })

    it('should return null for invalid file path', () => {
      const filePath = path.join(testProjectPath, 'src', 'uiengine', 'pages', 'page.md')
      assert.equal(ComponentUtil.componentFilePathToComponentId(componentsPath, filePath), null)
    })
  })

  describe('#componentPathToComponentId', () => {
    it('should return component id for component path', () => {
      const componentPath = path.join(componentsPath, 'button')
      assert.equal(ComponentUtil.componentPathToComponentId(componentsPath, componentPath), 'button')
    })
  })
})
