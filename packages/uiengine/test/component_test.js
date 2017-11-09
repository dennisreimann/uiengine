const path = require('path')
const assert = require('assert')

const { testProjectPath } = require('../../../test/support/paths')
const Component = require('../src/component')
const state = {
  config: {
    source: {
      components: path.resolve(testProjectPath, 'src', 'components')
    }
  }
}

const assertComponent = (componentIds, componentId) => assert(componentIds.includes(componentId), `missing component "${componentId}"`)

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

    it('should return component object for components without component.md file', done => {
      Component.fetchById(state, 'form')
        .then(data => {
          assert.equal(data.id, 'form')
          assert.equal(data.title, 'Form')
          done()
        })
        .catch(done)
    })

    it('should infer variantIds if they are not provided', done => {
      Component.fetchById(state, 'label')
        .then(data => {
          assert.equal(data.variantIds.length, 7)
          assert.equal(data.variantIds[0], 'label/label.hbs')
          assert.equal(data.variantIds[1], 'label/label.html')
          assert.equal(data.variantIds[2], 'label/label.js')
          assert.equal(data.variantIds[3], 'label/label.jsx')
          assert.equal(data.variantIds[4], 'label/label.marko')
          assert.equal(data.variantIds[5], 'label/label.pug')
          assert.equal(data.variantIds[6], 'label/label.vue')
          done()
        })
        .catch(done)
    })

    it('should not infer variantIds if they are explicitely provided by variants attribute', done => {
      Component.fetchById(state, 'input')
        .then(data => {
          assert.equal(data.variantIds.length, 5)
          assert.equal(data.variantIds[0], 'input/text.hbs')
          assert.equal(data.variantIds[1], 'input/text.pug')
          assert.equal(data.variantIds[2], 'input/text-required.pug')
          assert.equal(data.variantIds[3], 'input/text-disabled.pug')
          assert.equal(data.variantIds[4], 'input/number.pug')
          done()
        })
        .catch(done)
    })

    it('should render content from markdown', done => {
      Component.fetchById(state, 'input')
        .then(data => {
          assert.equal(data.content, '<p>An input field that can be used inside a form.</p>')
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

          assertComponent(componentIds, 'input')
          assertComponent(componentIds, 'label')
          assertComponent(componentIds, 'formfield')
          assertComponent(componentIds, 'form')

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
