const fs = require('fs-extra')
const { join, resolve } = require('path')
const Factory = require('./support/factory')
const assertExists = require('../../../test/support/assertExists')
const assertContentMatches = require('../../../test/support/assertContentMatches')
const Builder = require('../src/builder')
const NavigationData = require('../src/data/navigation')
const Theme = require('../src/theme')
const Connector = require('../src/connector')

const { testProjectPath, testTmpPath } = require('../../../test/support/paths')
const { adapters } = require('./support/adapters')
const target = resolve(testTmpPath, 'site')

const state = {
  config: {
    name: 'Builder Test',
    version: '0.1.0',
    update: Date.now(),
    source: {
      base: testProjectPath,
      configFile: resolve(testProjectPath, 'uiengine.config.js'),
      components: resolve(testProjectPath, 'src', 'components'),
      templates: resolve(testProjectPath, 'src', 'templates'),
      entities: resolve(testProjectPath, 'src', 'uiengine', 'entities'),
      pages: resolve(testProjectPath, 'src', 'uiengine', 'pages'),
      data: resolve(testProjectPath, '..', 'fixtures')
    },
    target,
    adapters,
    variantTemplate: 'variant-preview.pug',
    theme: {
      module: 'uiengine-theme-default',
      options: {}
    }
  },
  pages: {
    index: Factory.page('index', {
      title: 'Home',
      childIds: ['patterns', 'testcases']
    }),
    patterns: Factory.page('patterns', {
      title: 'Pattern Library',
      path: 'patterns',
      componentIds: ['input']
    }),
    prototype: Factory.page('prototype', {
      title: 'Sandbox',
      path: 'prototype',
      childIds: ['prototype/custom-page']
    }),
    'prototype/custom-page': Factory.page('prototype/custom-page', {
      title: 'Custom Page',
      template: 'page.pug',
      content: 'Content for custom template',
      context: {
        myContextVariable: 'This is my context'
      }
    }),
    entities: Factory.page('entities', {
      title: 'Entities',
      path: '_entities',
      type: 'entities'
    }),
    testcases: Factory.page('testcases', {
      title: 'Testcases',
      path: 'testcases',
      files: [
        resolve(testProjectPath, 'src', 'uiengine', 'pages', 'testcases', 'index.txt'),
        resolve(testProjectPath, 'src', 'uiengine', 'pages', 'testcases', 'extra-files', 'file-in-folder.txt'),
        resolve(testProjectPath, 'src', 'uiengine', 'pages', 'testcases', '_hidden-files', 'file-in-folder.txt')
      ]
    }),
    'testcases/custom-path': Factory.page('testcases/custom-path', {
      title: 'Custom Path',
      path: 'testcases/page-with-custom-path',
      files: [
        resolve(testProjectPath, 'src', 'uiengine', 'pages', 'testcases', 'custom-path', 'file.txt'),
        resolve(testProjectPath, 'src', 'uiengine', 'pages', 'testcases', 'custom-path', 'extra-files', 'file-in-folder.txt')
      ]
    })
  },
  navigation: {
    'index': NavigationData('index', 'index', 'Home', '', 'documentation', '<h1>Homepage</h1>', null, [], null, ['patterns', 'testcases']),
    'patterns': NavigationData('patterns', 'patterns', 'Pattern Library', 'patterns', 'documentation', '', null, ['index'], 'index', { childIds: ['patterns/input'] }),
    'patterns/input': NavigationData('patterns/input', 'input', 'Awesome Input', 'patterns/input', 'component', '', null, ['index', 'patterns'], 'patterns'),
    'prototype': NavigationData('prototype', 'prototype', 'Sandbox', 'prototype', 'documentation', '', null, ['index'], 'index'),
    'prototype/custom-page': NavigationData('prototype/custom-page', 'prototype/custom-page', 'Custom Page', 'prototype/custom-page', 'page', '', null, ['index', 'prototype'], 'prototype'),
    'entities': NavigationData('entities', 'entities', 'Entities', '_entities', 'entities', ''),
    'testcases': NavigationData('testcases', 'testcases', 'Testcases', 'testcases'),
    'testcases/custom-path': NavigationData('testcases/custom-path', 'testcases/custom-path', 'Custom Path', 'documentation')
  },
  components: {
    input: Factory.component('input', {
      title: 'Awesome Input',
      content: '<p>An input field that can be used inside a form.</p>',
      variants: [
        {
          id: 'input/text.pug',
          componentId: 'input',
          file: 'text.pug',
          path: resolve(testProjectPath, 'src', 'components', 'input', 'variants', 'text.pug'),
          content: '<p>This is documentation for the text input.</p>',
          rendered: '<input class="input input--text" id="name" name="person[name]" type="text"/>',
          context: { id: 'name', name: 'person[name]' },
          title: 'Text Input'
        }
      ]
    })
  },
  entities: {
    Entity: {
      title: {
        type: 'String',
        description: 'Title',
        required: true
      },
      date: {
        type: 'Date',
        description: 'Publising date',
        required: true
      },
      customObject: {
        type: 'CustomObject',
        description: 'A custom object'
      }
    },
    CustomObject: {
      tags: {
        type: 'Array',
        description: 'Tags as strings'
      },
      isHidden: {
        type: 'Boolean',
        default: 'false',
        description: 'Entity should be hidden'
      }
    }
  }
}

describe('Builder', () => {
  afterEach(() => { fs.removeSync(testTmpPath) })
  before(() => Promise.all([
    Theme.setup(state),
    Connector.setup(state)
  ]))

  describe('#generate', () => {
    it('should generate index page', async () => {
      await Builder.generate(state)

      assertExists(join(target, 'index.html'))
    })
  })

  describe('#generatePageWithTemplate', () => {
    it('should generate page with custom template', async () => {
      await Builder.generatePageWithTemplate(state, 'prototype/custom-page')

      const pagePath = join(target, '_pages', 'prototype', 'custom-page.html')
      assertContentMatches(pagePath, 'This is my context')
    })
  })

  describe('#generatePageFiles', () => {
    it('should copy page files', async () => {
      await Builder.generatePageFiles(state, 'testcases')

      assertExists(join(target, 'testcases', 'index.txt'))
      assertExists(join(target, 'testcases', 'extra-files', 'file-in-folder.txt'))
    })

    it('should copy page files for pages with custom paths', async () => {
      await Builder.generatePageFiles(state, 'testcases/custom-path')

      assertExists(join(target, 'testcases', 'page-with-custom-path', 'file.txt'))
      assertExists(join(target, 'testcases', 'page-with-custom-path', 'extra-files', 'file-in-folder.txt'))
    })
  })

  describe('#generatePagesWithTemplate', () => {
    it('should generate pages having this template', async () => {
      await Builder.generatePagesWithTemplate(state, 'page.pug')

      assertExists(join(target, '_pages', 'prototype', 'custom-page.html'))
    })
  })

  describe('#generateComponentVariants', () => {
    it('should generate component variant pages', async () => {
      await Builder.generateComponentVariants(state, 'input')

      assertExists(join(target, '_variants', 'input', 'text.pug.html'))
    })
  })

  describe('#generateVariant', () => {
    it('should generate variant page', async () => {
      const variant = state.components.input.variants[0]
      await Builder.generateVariant(state, variant)

      assertExists(join(target, '_variants', 'input', 'text.pug.html'))
    })
  })

  describe('#generateIncrement', () => {
    describe('with debug level set', () => {
      it('should generate state file', async () => {
        const stateWithDebug = Object.assign({}, state)
        stateWithDebug.config.debug = true

        await Builder.generateIncrement(stateWithDebug)

        assertExists(join(target, '_state.json'))
      })
    })
  })
})
