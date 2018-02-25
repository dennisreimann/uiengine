const assert = require('assert')
const fs = require('fs-extra')
const { resolve } = require('path')
const Connector = require('../src/connector')

const { testProjectPath, testTmpPath } = require('../../../test/support/paths')
const { adapters } = require('./support/adapters')
const Component = require('../src/component')
const state = {
  config: {
    source: {
      components: resolve(testProjectPath, 'src', 'components'),
      data: resolve(__dirname, 'fixtures'),
      base: testProjectPath
    },
    adapters
  }
}

const assertComponent = (componentIds, componentId) => assert(componentIds.includes(componentId), `missing component "${componentId}"`)

describe('Component', () => {
  afterEach(() => { fs.removeSync(testTmpPath) })
  before(() => { Connector.setup(state) })

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

    it('should infer variants if they are not provided', async () => {
      const data = await Component.fetchById(state, 'formfield')

      assert.equal(Object.keys(data.variants).length, 2)
      assert.equal(data.variants[0].id, 'formfield/text-with-label.pug')
      assert.equal(data.variants[1].id, 'formfield/text-without-label.pug')
    })

    it('should not infer variants if they are explicitely provided by variants attribute', async () => {
      const data = await Component.fetchById(state, 'label')

      assert.equal(Object.keys(data.variants).length, 8)
      assert.equal(data.variants[0].id, 'label/label.ejs')
      assert.equal(data.variants[1].id, 'label/label.hbs')
      assert.equal(data.variants[2].id, 'label/label.html')
      assert.equal(data.variants[3].id, 'label/label.marko')
      assert.equal(data.variants[4].id, 'label/label.pug')
      assert.equal(data.variants[5].id, 'label/label.jsx')
      assert.equal(data.variants[6].id, 'label/label-vue.js')
      assert.equal(data.variants[7].id, 'label/label-vue-sfc.vhtml')
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
