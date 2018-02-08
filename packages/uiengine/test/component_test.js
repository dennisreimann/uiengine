const assert = require('assert')
const { resolve } = require('path')

const { testProjectPath } = require('../../../test/support/paths')
const Component = require('../src/component')
const state = {
  config: {
    source: {
      components: resolve(testProjectPath, 'src', 'components')
    }
  }
}

const assertComponent = (componentIds, componentId) => assert(componentIds.includes(componentId), `missing component "${componentId}"`)

describe('Component', () => {
  describe('#fetchById', () => {
    it('should return component object', async () => {
      const data = await Component.fetchById(state, 'input')

      assert.equal(data.id, 'input')
    })

    it('should return component object for components without component.md file', async () => {
      const data = await Component.fetchById(state, 'form')

      assert.equal(data.id, 'form')
      assert.equal(data.title, 'Form')
    })

    it('should infer variantIds if they are not provided', async () => {
      const data = await Component.fetchById(state, 'label')

      assert.equal(data.variantIds.length, 8)
      assert.equal(data.variantIds[0], 'label/label-ejs.ejs')
      assert.equal(data.variantIds[1], 'label/label-handlebars.hbs')
      assert.equal(data.variantIds[2], 'label/label-html.html')
      assert.equal(data.variantIds[3], 'label/label-marko.marko')
      assert.equal(data.variantIds[4], 'label/label-pug.pug')
      assert.equal(data.variantIds[5], 'label/label-react.jsx')
      assert.equal(data.variantIds[6], 'label/label-vue-js.js')
      assert.equal(data.variantIds[7], 'label/label-vue-sfc.vhtml')
    })

    it('should not infer variantIds if they are explicitely provided by variants attribute', async () => {
      const data = await Component.fetchById(state, 'input')

      assert.equal(data.variantIds.length, 5)
      assert.equal(data.variantIds[0], 'input/text.hbs')
      assert.equal(data.variantIds[1], 'input/text.pug')
      assert.equal(data.variantIds[2], 'input/text-required.pug')
      assert.equal(data.variantIds[3], 'input/text-disabled.pug')
      assert.equal(data.variantIds[4], 'input/number.pug')
    })

    it('should render content from markdown', async () => {
      const data = await Component.fetchById(state, 'input')

      assert.equal(data.content, '<p>An input field that can be used inside a form.</p>')
    })

    it('should return empty object if components source is not set', async () => {
      const data = await Component.fetchAll({ config: { source: { } } })
      const componentIds = Object.keys(data)

      assert.equal(componentIds.length, 0)
    })
  })

  describe('#fetchAll', () => {
    it('should return components object', async () => {
      const data = await Component.fetchAll(state)
      const componentIds = Object.keys(data)

      assert.equal(componentIds.length, 4)
      assertComponent(componentIds, 'input')
      assertComponent(componentIds, 'label')
      assertComponent(componentIds, 'formfield')
      assertComponent(componentIds, 'form')
    })

    it('should return empty object if components source is not set', async () => {
      const data = await Component.fetchAll({ config: { source: { } } })
      const componentIds = Object.keys(data)

      assert.equal(componentIds.length, 0)
    })
  })
})
