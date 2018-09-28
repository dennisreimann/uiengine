const assert = require('assert')
const { removeSync } = require('fs-extra')
const { resolve } = require('path')
const Connector = require('../src/connector')

const { testProjectPath, testTmpPath } = require('../../../test/support/paths')
const { adapters } = require('./support/adapters')
const Component = require('../src/component')
const state = {
  config: {
    source: {
      components: [
        resolve(testProjectPath, 'src', 'elements'),
        resolve(testProjectPath, 'src', 'modules')
      ],
      templates: resolve(testProjectPath, 'src', 'templates'),
      data: resolve(__dirname, 'fixtures'),
      base: testProjectPath
    },
    adapters
  }
}

const assertComponent = (componentIds, componentId) => assert(componentIds.includes(componentId), `missing component "${componentId}"`)

describe('Component', () => {
  before(() => { Connector.setup(state) })
  afterEach(() => { removeSync(testTmpPath) })

  describe('#fetchById', () => {
    it('should return component object', async () => {
      const data = await Component.fetchById(state, 'input')

      assert.strictEqual(data.id, 'input')
      assert.strictEqual(data.title, 'Inputs')
      assert.strictEqual(data.sourcePath, 'src/elements/input')
      assert.strictEqual(data.sourceFile, 'src/elements/input/component.md')
    })

    it('should return component object for components without component.md file', async () => {
      const data = await Component.fetchById(state, 'form')

      assert.strictEqual(data.id, 'form')
      assert.strictEqual(data.title, 'Form')
      assert.strictEqual(data.sourcePath, 'src/modules/form')
      assert.strictEqual(data.sourceFile, undefined)
    })

    it('should infer variants if they are not provided', async () => {
      const data = await Component.fetchById(state, 'formfield')

      assert.strictEqual(Object.keys(data.variants).length, 2)
      assert.strictEqual(data.variants[0].id, 'formfield/text-with-label.pug-1')
      assert.strictEqual(data.variants[1].id, 'formfield/text-without-label.pug-2')
    })

    it('should not infer variants if they are explicitely provided by variants attribute', async () => {
      const data = await Component.fetchById(state, 'label')

      assert.strictEqual(Object.keys(data.variants).length, 9)
      assert.strictEqual(data.variants[0].id, 'label/label.ejs-1')
      assert.strictEqual(data.variants[1].id, 'label/label.hbs-2')
      assert.strictEqual(data.variants[2].id, 'label/label.html-3')
      assert.strictEqual(data.variants[3].id, 'label/label.marko-4')
      assert.strictEqual(data.variants[4].id, 'label/label.pug-5')
      assert.strictEqual(data.variants[5].id, 'label/label.jsx-6')
      assert.strictEqual(data.variants[6].id, 'label/label.jsx-7')
      assert.strictEqual(data.variants[7].id, 'label/label-vue.js-8')
      assert.strictEqual(data.variants[8].id, 'label/label-vue-sfc.vhtml-9')
    })

    it('should render content from markdown', async () => {
      const data = await Component.fetchById(state, 'input')

      assert.strictEqual(data.content, '<p>An input field that can be used inside a form.</p>')
    })

    it('should return null if components source is not set', async () => {
      const data = await Component.fetchById({ config: { source: { } } }, 'input')

      assert.strictEqual(null, data)
    })

    it('should resolve title from attributes', async () => {
      const data = await Component.fetchById(state, 'input')

      assert.strictEqual('Inputs', data.title)
    })

    it('should resolve title from content heading if there is no title in attributes', async () => {
      const data = await Component.fetchById(state, 'formfield')

      assert.strictEqual('Formfields', data.title)
    })

    it('should resolve title from component id if there is no title in attributes or content', async () => {
      const data = await Component.fetchById(state, 'label')

      assert.strictEqual('Label', data.title)
    })

    it('should register component files and extract properties', async () => {
      const data = await Component.fetchById(state, 'label')
      const labelProps = data.properties['<Label>']

      assert(labelProps, 'React Label properties are not defined')
      assert.strictEqual(labelProps.title.type, 'String')
      assert.strictEqual(labelProps.title.required, true)
      assert.strictEqual(labelProps.for.type, 'String')
      assert.strictEqual(labelProps.for.required, true)
    })

    it('should register component files and extract dependencies', async () => {
      const data = await Component.fetchById(state, 'formfield')
      const { dependencies } = data

      assert(dependencies, 'Formfield dependencies are not defined')
      assert.strictEqual(dependencies.length, 2)
      assert(dependencies.includes('label'), 'Formfield dependencies do not include "label".')
      assert(dependencies.includes('input'), 'Formfield dependencies do not include "input".')
    })

    it('should register component files and extract dependents', async () => {
      const data = await Component.fetchById(state, 'label')
      const { dependentComponents, dependentTemplates } = data
      
      assert(dependentComponents, 'Dependent components for label are not defined')
      assert.strictEqual(dependentComponents.length, 1)
      assert(dependentComponents.includes('formfield'), 'Dependent components for label do not include "formfield".')

      assert(dependentTemplates, 'Dependent templates for label are not defined')
      assert.strictEqual(dependentTemplates.length, 1)
      assert(dependentTemplates.includes('page.pug'), 'Dependent templates for label do not include "page.pug".')
    })
  })

  describe('#fetchAll', () => {
    it('should return components object', async () => {
      const data = await Component.fetchAll(state)
      const componentIds = Object.keys(data)

      assert.strictEqual(componentIds.length, 4)
      assertComponent(componentIds, 'input')
      assertComponent(componentIds, 'label')
      assertComponent(componentIds, 'formfield')
      assertComponent(componentIds, 'form')
    })

    it('should return empty object if components source is not set', async () => {
      const data = await Component.fetchAll({ config: { source: { } } })
      const componentIds = Object.keys(data)

      assert.strictEqual(componentIds.length, 0)
    })
  })
})
