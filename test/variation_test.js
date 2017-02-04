/* global describe, it */
const path = require('path')
const assert = require('assert')

const Variation = require('../lib/variation')
const state = {
  config: {
    source: {
      components: path.resolve(__dirname, '..', 'sample_project', 'src', 'components')
    }
  }
}

describe('Variation', () => {
  describe('#fetchById', () => {
    it('should return variation object', done => {
      Variation.fetchById(state, 'input/text')
        .then(data => {
          assert.equal(data.id, 'input/text')
          assert.equal(data.raw, 'include /input/input.pug\n\n+input(id, name)')
          assert.equal(data.title, 'Text Input')
          assert.equal(data.context.id, 'name')
          assert.equal(data.context.name, 'person[name]')
          done()
        })
        .catch(done)
    })
  })

  describe('#fetchAll', () => {
    it('should return variations object', done => {
      Variation.fetchAll(state)
        .then(data => {
          const variationIds = Object.keys(data)

          assert.equal(variationIds.length, 9)
          assert(variationIds.includes('input/checkbox'), 'missing variation "input/checkbox"')
          assert(variationIds.includes('input/number'), 'missing variation "input/number"')
          assert(variationIds.includes('input/text'), 'missing variation "input/text"')
          assert(variationIds.includes('input/text-disabled'), 'missing variation "input/text-disabled"')
          assert(variationIds.includes('input/text-required'), 'missing variation "input/text-required"')
          assert(variationIds.includes('label/label'), 'missing variation "label/label"')
          assert(variationIds.includes('formrow/text-with-label'), 'missing variation "formrow/text-with-label"')
          assert(variationIds.includes('formrow/text-without-label'), 'missing variation "formrow/text-without-label"')
          assert(variationIds.includes('form/form'), 'missing variation "form/form"')
          done()
        })
        .catch(done)
    })

    it('should return empty object if components source is not set', done => {
      Variation.fetchAll({ config: { source: { } } })
        .then(data => {
          const variationIds = Object.keys(data)

          assert.equal(variationIds.length, 0)
          done()
        })
        .catch(done)
    })
  })
})
