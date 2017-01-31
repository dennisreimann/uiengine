/* global describe, it */
const path = require('path')
const assert = require('assert')

const Component = require('../lib/component')
const state = {
  config: {
    source: {
      components: path.resolve(__dirname, '../sample_project/components')
    }
  }
}

describe('Component', () => {
  describe('#fetchById', () => {
    it('should return component object', done => {
      Component.fetchById(state, 'input')
        .then(data => {
          assert.equal(data.id, 'input')
          done()
        })
        .catch(done)
    })

    it('should infer variationIds if they are not provided', done => {
      Component.fetchById(state, 'formrow')
        .then(data => {
          assert.equal(data.variationIds.length, 2)
          assert.equal(data.variationIds[0], 'formrow/text-with-label')
          assert.equal(data.variationIds[1], 'formrow/text-without-label')
          done()
        })
        .catch(done)
    })

    it('should not infer childIds if they are explicitely provided', done => {
      Component.fetchById(state, 'input')
        .then(data => {
          assert.equal(data.variationIds.length, 5)
          assert.equal(data.variationIds[0], 'text')
          assert.equal(data.variationIds[1], 'text-required')
          assert.equal(data.variationIds[2], 'text-disabled')
          assert.equal(data.variationIds[3], 'number')
          assert.equal(data.variationIds[4], 'checkbox')
          done()
        })
        .catch(done)
    })

    it('should render content from markdown', done => {
      Component.fetchById(state, 'input')
        .then(data => {
          assert.equal(data.content, '<p>An input field that can be used inside a form.</p>\n')
          done()
        })
        .catch(done)
    })

    it('should return empty object if components source is not set', done => {
      Component.fetchAll({ config: { source: { } } })
        .then(data => {
          const componentIds = Object.keys(data)

          assert.equal(componentIds.length, 0)
          done()
        })
        .catch(done)
    })
  })

  describe('#fetchAll', () => {
    it('should return components object', done => {
      Component.fetchAll(state)
        .then(data => {
          const componentIds = Object.keys(data)

          assert.equal(componentIds.length, 4)
          assert(componentIds.includes('input'), 'missing component "input"')
          assert(componentIds.includes('label'), 'missing component "label"')
          assert(componentIds.includes('formrow'), 'missing component "formrow"')
          assert(componentIds.includes('form'), 'missing component "form"')
          done()
        })
        .catch(done)
    })

    it('should return empty object if components source is not set', done => {
      Component.fetchAll({ config: { source: { } } })
        .then(data => {
          const componentIds = Object.keys(data)

          assert.equal(componentIds.length, 0)
          done()
        })
        .catch(done)
    })
  })
})
