const path = require('path')
const assert = require('assert')

const Schema = require('../src/schema')
const schemaPath = path.resolve(__dirname, 'project', 'src', 'uiengine', 'schema')
const state = {
  config: {
    source: {
      schema: schemaPath
    }
  }
}

describe('Schema', () => {
  describe('#fetchById', () => {
    it('should return single schema object', done => {
      Schema.fetchById(state, 'Entity')
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
    it('should return whole schema object', done => {
      Schema.fetchAll(state)
        .then(data => {
          assert.equal(Object.keys(data).length, 2)

          assert(data['Entity'], 'missing schema for "Entity"')
          assert(data['CustomObject'], 'missing schema for "CustomObject"')

          done()
        })
        .catch(done)
    })

    it('should return empty object if schema source is not set', done => {
      Schema.fetchAll({ config: { source: { } } })
        .then(data => {
          const schemaIds = Object.keys(data)

          assert.equal(schemaIds.length, 0)
          done()
        })
        .catch(done)
    })
  })
})
