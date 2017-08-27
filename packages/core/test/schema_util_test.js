const path = require('path')
const assert = require('assert')

const SchemaUtil = require('../src/util/schema')
const { testProjectPath } = require('./support/paths')
const schemaPath = path.resolve(testProjectPath, 'src', 'uiengine', 'schema')

describe('SchemaUtil', () => {
  describe('#schemaIdToTitle', () => {
    it('should return titleized name', () => {
      assert.equal(SchemaUtil.schemaIdToTitle('entity'), 'Entity')
      assert.equal(SchemaUtil.schemaIdToTitle('entities/entity'), 'Entity')
      assert.equal(SchemaUtil.schemaIdToTitle('magic-entity'), 'Magic Entity')
    })
  })

  describe('#schemaIdToSchemaFilePath', () => {
    it('should return schema file path for schema', () => {
      assert.equal(
        SchemaUtil.schemaIdToSchemaFilePath(schemaPath, 'Entity'),
        path.join(schemaPath, 'Entity.yml')
      )
    })
  })

  describe('#schemaFilePathToSchemaId', () => {
    it('should return schema id for schema file path', () => {
      assert.equal(SchemaUtil.schemaFilePathToSchemaId(schemaPath, path.join(schemaPath, 'Entity.yml')), 'Entity')
    })

    it('should return null for invalid file path', () => {
      const filePath = path.resolve(testProjectPath, 'src', 'components', 'component.md')
      assert.equal(SchemaUtil.schemaFilePathToSchemaId(schemaPath, filePath), null)
    })
  })
})
