const assert = require('assert')
const { join, resolve } = require('path')

const EntityUtil = require('../src/entity')
const { testProjectPath } = require('../../../test/support/paths')
const entitiesPath = resolve(testProjectPath, 'src', 'uiengine', 'entities')

describe('EntityUtil', () => {
  describe('#entityIdToTitle', () => {
    it('should return titleized name', () => {
      assert.equal(EntityUtil.entityIdToTitle('entity'), 'Entity')
      assert.equal(EntityUtil.entityIdToTitle('entities/entity'), 'Entity')
      assert.equal(EntityUtil.entityIdToTitle('magic-entity'), 'Magic Entity')
    })
  })

  describe('#entityIdToEntityFilePath', () => {
    it('should return entities file path for entities', () => {
      assert.equal(
        EntityUtil.entityIdToEntityFilePath(entitiesPath, 'Entity'),
        join(entitiesPath, 'Entity.yml')
      )
    })
  })

  describe('#entityFilePathToEntityId', () => {
    it('should return entities id for entities file path', () => {
      const entityPath = join(entitiesPath, 'Entity.yml')
      assert.equal(EntityUtil.entityFilePathToEntityId(entitiesPath, entityPath), 'Entity')
    })

    it('should return null for invalid file path', () => {
      const filePath = resolve(testProjectPath, 'src', 'components', 'component.md')
      assert.equal(EntityUtil.entityFilePathToEntityId(entitiesPath, filePath), null)
    })
  })
})
