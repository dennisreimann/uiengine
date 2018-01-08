const fs = require('fs-extra')
const path = require('path')
const Factory = require('./support/factory')
const assertExists = require('./support/assertExists')
const assertContentMatches = require('./support/assertContentMatches')
const Builder = require('../src/builder')
const NavigationData = require('../src/data/navigation')
const Theme = require('../src/theme')
const Connector = require('../src/connector')

const { testProjectPath, testTmpPath } = require('../../../test/support/paths')
const target = path.resolve(testTmpPath, 'site')

const state = {
  config: {
    name: 'Builder Test',
    version: '0.1.0',
    update: Date.now(),
    source: {
      base: testProjectPath,
      configFile: path.resolve(testProjectPath, 'uiengine.yml'),
      components: path.resolve(testProjectPath, 'src', 'components'),
      templates: path.resolve(testProjectPath, 'src', 'templates'),
      pages: path.resolve(testProjectPath, 'src', 'uiengine', 'pages'),
      schema: path.resolve(testProjectPath, 'src', 'uiengine', 'schema'),
      data: path.resolve(testProjectPath, '..', 'fixtures')
    },
    target,
    adapters: {
      pug: {
        module: 'uiengine-adapter-pug',
        options: {
          pretty: true,
          basedir: path.resolve(testProjectPath, 'src', 'components')
        }
      },
      jsx: {
        module: 'uiengine-adapter-react',
        options: {}
      },
      hbs: {
        module: 'uiengine-adapter-handlebars',
        options: {}
      },
      marko: {
        module: 'uiengine-adapter-marko',
        options: {}
      }
    },
    templates: {
      variant: path.resolve(testProjectPath, 'src', 'templates', 'variant-preview.pug'),
      custom: path.resolve(testProjectPath, 'src', 'templates', 'custom.pug'),
      page: path.resolve(testProjectPath, 'src', 'templates', 'page.pug')
    },
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
      template: 'page',
      content: 'Content for custom template',
      context: {
        myContextVariable: 'This is my context'
      }
    }),
    schema: Factory.page('schema', {
      title: 'Schema',
      path: '_schema',
      type: 'schema'
    }),
    testcases: Factory.page('testcases', {
      title: 'Testcases',
      path: 'testcases',
      files: [
        path.resolve(testProjectPath, 'src', 'uiengine', 'pages', 'testcases', 'index.txt'),
        path.resolve(testProjectPath, 'src', 'uiengine', 'pages', 'testcases', 'extra-files', 'file-in-folder.txt'),
        path.resolve(testProjectPath, 'src', 'uiengine', 'pages', 'testcases', '_hidden-files', 'file-in-folder.txt')
      ]
    }),
    'testcases/custom-path': Factory.page('testcases/custom-path', {
      title: 'Custom Path',
      path: 'testcases/page-with-custom-path',
      files: [
        path.resolve(testProjectPath, 'src', 'uiengine', 'pages', 'testcases', 'custom-path', 'file.txt'),
        path.resolve(testProjectPath, 'src', 'uiengine', 'pages', 'testcases', 'custom-path', 'extra-files', 'file-in-folder.txt')
      ]
    })
  },
  navigation: {
    'index': NavigationData('index', 'index', 'Home', '', 'documentation', '<h1>Homepage</h1>', [], null, ['patterns', 'testcases']),
    'patterns': NavigationData('patterns', 'patterns', 'Pattern Library', 'patterns', 'documentation', '', ['index'], 'index', { childIds: ['patterns/input'] }),
    'patterns/input': NavigationData('patterns/input', 'input', 'Awesome Input', 'patterns/input', 'component', '', ['index', 'patterns'], 'patterns'),
    'prototype': NavigationData('prototype', 'prototype', 'Sandbox', 'prototype', 'documentation', '', ['index'], 'index'),
    'prototype/custom-page': NavigationData('prototype/custom-page', 'prototype/custom-page', 'Custom Page', 'prototype/custom-page', 'page', '', ['index', 'prototype'], 'prototype'),
    'schema': NavigationData('schema', 'schema', 'Schema', '_schema', 'schema', ''),
    'testcases': NavigationData('testcases', 'testcases', 'Testcases', 'testcases'),
    'testcases/custom-path': NavigationData('testcases/custom-path', 'testcases/custom-path', 'Custom Path', 'documentation')
  },
  components: {
    input: Factory.component('input', {
      title: 'Awesome Input',
      variantIds: ['input/text.pug'],
      content: '<p>An input field that can be used inside a form.</p>'
    })
  },
  variants: {
    'input/text.pug': {
      id: 'input/text.pug',
      componentId: 'input',
      path: path.resolve(testProjectPath, 'src', 'components', 'input', 'variants', 'text.pug'),
      content: '<p>This is documentation for the text input.</p>',
      rendered: '<input class="input input--text" id="name" name="person[name]" type="text"/>',
      context: { id: 'name', name: 'person[name]' },
      title: 'Text Input'
    }
  },
  schema: {
    'Entity': {
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
    'CustomObject': {
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
    it('should generate index page', done => {
      Builder.generate(state)
        .then(() => {
          assertExists(path.join(target, 'index.html'))

          done()
        })
        .catch(done)
    })
  })

  describe('#generatePageWithTemplate', () => {
    it('should generate page with custom template', done => {
      Builder.generatePageWithTemplate(state, 'prototype/custom-page')
        .then(() => {
          const pagePath = path.join(target, '_pages', 'prototype', 'custom-page.html')

          assertContentMatches(pagePath, 'This is my context')

          done()
        })
        .catch(done)
    })
  })

  describe('#generatePageFiles', () => {
    it('should copy page files', done => {
      Builder.generatePageFiles(state, 'testcases')
        .then(() => {
          assertExists(path.join(target, 'testcases', 'index.txt'))
          assertExists(path.join(target, 'testcases', 'extra-files', 'file-in-folder.txt'))

          done()
        })
        .catch(done)
    })

    it('should copy page files for pages with custom paths', done => {
      Builder.generatePageFiles(state, 'testcases/custom-path')
        .then(() => {
          assertExists(path.join(target, 'testcases', 'page-with-custom-path', 'file.txt'))
          assertExists(path.join(target, 'testcases', 'page-with-custom-path', 'extra-files', 'file-in-folder.txt'))

          done()
        })
        .catch(done)
    })
  })

  describe('#generatePagesWithTemplate', () => {
    it('should generate pages having this template', done => {
      Builder.generatePagesWithTemplate(state, 'page')
        .then(() => {
          assertExists(path.join(target, '_pages', 'prototype', 'custom-page.html'))

          done()
        })
        .catch(done)
    })
  })

  describe('#generateComponentVariants', () => {
    it('should generate component variant pages', done => {
      Builder.generateComponentVariants(state, 'input')
        .then(() => {
          assertExists(path.join(target, '_variants', 'input', 'text.pug.html'))

          done()
        })
        .catch(done)
    })
  })

  describe('#generateVariant', () => {
    it('should generate variant page', done => {
      Builder.generateVariant(state, 'input/text.pug')
        .then(() => {
          assertExists(path.join(target, '_variants', 'input', 'text.pug.html'))

          done()
        })
        .catch(done)
    })
  })

  describe('#generateIncrement', () => {
    describe('with debug level set', () => {
      it('should generate state file', done => {
        const stateWithDebug = Object.assign({}, state)
        stateWithDebug.config.debug = true

        Builder.generateIncrement(stateWithDebug)
          .then(() => {
            assertExists(path.join(target, '_state.json'))

            done()
          })
          .catch(done)
      })
    })
  })
})
