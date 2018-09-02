const assert = require('assert')
const { resolve } = require('path')

const Entity = require('../src/entity')
const { testProjectPath } = require('../../../test/support/paths')
const entitiesPath = resolve(testProjectPath, 'uiengine', 'entities')
const state = {
  config: {
    source: {
      entities: entitiesPath
    }
  }
}

describe('Entity', () => {
  describe('#fetchById', () => {
    it('should return single entity object', async () => {
      const data = await Entity.fetchById(state, 'Entity')

      assert.strictEqual(data.title.type, 'String')
      assert.strictEqual(data.title.description, 'Title')
      assert.strictEqual(data.title.required, true)
      assert.strictEqual(data.date.type, 'Date')
      assert.strictEqual(data.date.description, 'Publising date')
      assert.strictEqual(data.date.required, true)
    })
  })

  describe('#fetchAll', () => {
    it('should return whole entities object', async () => {
      const data = await Entity.fetchAll(state)

      assert.strictEqual(Object.keys(data).length, 2)
      assert(data['Entity'], 'missing entity for "Entity"')
      assert(data['CustomObject'], 'missing entity for "CustomObject"')
    })

    it('should return empty object if entities source is not set', async () => {
      const data = await Entity.fetchAll({ config: { source: {} } })
      const ids = Object.keys(data)

      assert.strictEqual(ids.length, 0)
    })
  })
})
