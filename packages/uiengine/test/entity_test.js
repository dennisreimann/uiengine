const path = require('path')
const assert = require('assert')

const Entity = require('../src/entity')
const { testProjectPath } = require('../../../test/support/paths')
const entitiesPath = path.resolve(testProjectPath, 'src', 'uiengine', 'entities')
const state = {
  config: {
    source: {
      entities: entitiesPath
    }
  }
}

describe('Entity', () => {
  describe('#fetchById', () => {
    it('should return single entity object', done => {
      Entity.fetchById(state, 'Entity')
        .then(data => {
          assert.equal(data.title.type, 'String')
          assert.equal(data.title.description, 'Title')
          assert.equal(data.title.required, true)

          assert.equal(data.date.type, 'Date')
          assert.equal(data.date.description, 'Publising date')
          assert.equal(data.date.required, true)

          done()
        })
        .catch(done)
    })
  })

  describe('#fetchAll', () => {
    it('should return whole entities object', done => {
      Entity.fetchAll(state)
        .then(data => {
          assert.equal(Object.keys(data).length, 2)

          assert(data['Entity'], 'missing entity for "Entity"')
          assert(data['CustomObject'], 'missing entity for "CustomObject"')

          done()
        })
        .catch(done)
    })

    it('should return empty object if entities source is not set', done => {
      Entity.fetchAll({ config: { source: {} } })
        .then(data => {
          const ids = Object.keys(data)

          assert.equal(ids.length, 0)
          done()
        })
        .catch(done)
    })
  })
})
