/* global describe, it */
const path = require('path')
const assert = require('assert')

const Variation = require('../src/variation')
const state = {
  config: {
    source: {
      components: path.resolve(__dirname, 'project', 'src', 'components')
    }
  }
}

describe('Variation', () => {
  describe('#fetchById', () => {
    it('should return variation object', done => {
      Variation.fetchById(state, 'input/text.pug')
        .then(data => {
          assert.equal(data.id, 'input/text.pug')
          assert.equal(data.title, 'Text Input')
          assert.equal(data.content, '<p>This is documentation for the text input.</p>')
          assert.equal(data.context.id, 'name')
          assert.equal(data.context.name, 'person[name]')
          done()
        })
        .catch(done)
    })

    it('should infer variation title if it is not provided', done => {
      Variation.fetchById(state, 'form/form.pug')
        .then(data => {
          assert.equal(data.title, 'Form')
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

          assert.equal(variationIds.length, 12);

          [ 'input/checkbox.pug',
            'input/number.pug',
            'input/text.hbs',
            'input/text.pug',
            'input/text-disabled.pug',
            'input/text-required.pug',
            'label/label.hbs',
            'label/label.jsx',
            'label/label.pug',
            'formrow/text-with-label.pug',
            'formrow/text-without-label.pug',
            'form/form.pug'
          ].map(id => {
            assert(variationIds.includes(id), `missing variation "${id}"`)
          })

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
