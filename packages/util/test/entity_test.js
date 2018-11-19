const assert = require('assert')
const { join, resolve } = require('path')

const EntityUtil = require('../src/entity')
const { testProjectPath } = require('../../../test/support/paths')
const entitiesPath = resolve(testProjectPath, 'uiengine', 'entities')

describe('EntityUtil', () => {
  describe('#entityIdToTitle', () => {
    it('should return titleized name', () => {
      assert.strictEqual(EntityUtil.entityIdToTitle('entity'), 'Entity')
      assert.strictEqual(EntityUtil.entityIdToTitle('entities/entity'), 'Entity')
      assert.strictEqual(EntityUtil.entityIdToTitle('magic-entity'), 'Magic Entity')
    })
  })

  describe('#entityIdToFilePath', () => {
    it('should return entities file path for entities', () => {
      assert.strictEqual(
        EntityUtil.entityIdToFilePath(entitiesPath, 'Entity'),
        join(entitiesPath, 'Entity.js')
      )
    })
  })

  describe('#entityFilePathToId', () => {
    it('should return entities id for entities file path', () => {
      const entityPath = join(entitiesPath, 'Entity.js')
      assert.strictEqual(EntityUtil.entityFilePathToId(entitiesPath, entityPath), 'Entity')
    })

    it('should return null for invalid file path', () => {
      const filePath = resolve(testProjectPath, 'src', 'components', 'component.config.js')
      assert.strictEqual(EntityUtil.entityFilePathToId(entitiesPath, filePath), null)
    })
  })
})
