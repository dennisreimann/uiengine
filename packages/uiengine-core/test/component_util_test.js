/* global describe, it */
const path = require('path')
const assert = require('assert')

const ComponentUtil = require('../src/util/component')

const componentsPath = path.resolve(__dirname, 'project', 'src', 'components')

describe('ComponentUtil', () => {
  describe('#componentIdToPath', () => {
    it('should return path for component', () => {
      assert.equal(
        ComponentUtil.componentIdToPath(componentsPath, 'button'),
        path.join(componentsPath, 'button')
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

    it('should return component id for variation file path', () => {
      const filePath = path.join(componentsPath, 'button', 'variations', 'button.pug')
      assert.equal(ComponentUtil.componentFilePathToComponentId(componentsPath, filePath), 'button')
    })

    it('should return null for invalid file path', () => {
      const filePath = path.join(__dirname, 'project', 'src', 'pages', 'page.md')
      assert.equal(ComponentUtil.componentFilePathToComponentId(componentsPath, filePath), null)
    })
  })
})
