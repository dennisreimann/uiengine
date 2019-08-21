const { removeSync } = require('fs-extra')
const { join, resolve } = require('path')
const Factory = require('./support/factory')
const assert = require('assert')
const { assertContentMatches, assertContentDoesNotMatch, assertMatches, assertExists, assertDoesNotExist } = require('../../../test/support/asserts')
const Builder = require('../src/builder')

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
      components: [resolve(testProjectPath, 'src', 'elements'), resolve(testProjectPath, 'src', 'modules')],
      templates: resolve(testProjectPath, 'src', 'templates'),
      pages: resolve(testProjectPath, 'uiengine', 'pages'),
      data: resolve(testProjectPath, '..', 'fixtures')
    },
    template: 'uiengine.pug',
    themes: [
      {
        id: '_default',
        title: 'Default'
      }
    ],
    ui: {
      base: '/'
    },
    target,
    adapters
  },

  pages: {
    index: Factory.page('index', {
      title: 'Home',
      path: '',
      content: '<h1>Homepage</h1>',
      childIds: ['patterns', 'testcases', 'tokens', 'tokens-with-custom-template']
    }),

    patterns: Factory.page('patterns', {
      title: 'Pattern Library',
      path: 'patterns',
      componentIds: ['input']
    }),

    tokens: Factory.page('tokens', {
      title: 'Tokens',
      path: 'tokens',
      tokens: [
        {
          name: 'Test',
          type: 'color',
          value: '#123456'
        }
      ]
    }),

    'tokens-with-custom-template': Factory.page('tokens-with-custom-template', {
      title: 'Tokens with custom template',
      path: 'tokens-with-custom-template',
      template: 'page.pug',
      tokens: [
        {
          name: 'Test',
          type: 'color',
          value: '#123456'
        }
      ]
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

    'prototype/custom-page-with-fragment': Factory.page('prototype/custom-page-with-fragment', {
      title: 'Custom Page with Fragment',
      fragment: 'fragment.pug',
      content: 'Content for custom page with fragment',
      context: {
        myFragmentVariable: 'This is my fragment'
      }
    }),

    'prototype/custom-page-with-fragment-and-template': Factory.page('prototype/custom-page-with-fragment-and-template', {
      title: 'Custom Page with Fragment and Template',
      template: 'template.pug',
      fragment: 'fragment.pug',
      content: 'Content for custom page with fragment and template',
      context: {
        myContextVariable: 'This is my context',
        myFragmentVariable: 'This is my fragment'
      }
    }),

    testcases: Factory.page('testcases', {
      title: 'Testcases',
      path: 'testcases',
      files: [
        resolve(testProjectPath, 'uiengine', 'pages', 'testcases', 'index.txt'),
        resolve(testProjectPath, 'uiengine', 'pages', 'testcases', 'extra-files', 'file-in-folder.txt'),
        resolve(testProjectPath, 'uiengine', 'pages', 'testcases', 'extra-files', 'subfolder', 'file-in-subfolder.txt'),
        resolve(testProjectPath, 'uiengine', 'pages', 'testcases', '_hidden-files', 'file-in-folder.txt')
      ]
    }),

    'testcases/custom-path': Factory.page('testcases/custom-path', {
      title: 'Custom Path',
      path: 'testcases/page-with-custom-path',
      files: [
        resolve(testProjectPath, 'uiengine', 'pages', 'testcases', 'custom-path', 'file.txt'),
        resolve(testProjectPath, 'uiengine', 'pages', 'testcases', 'custom-path', 'extra-files', 'file-in-folder.txt')
      ]
    })
  },

  navigation: {
    index: Factory.navigation('index', {
      itemId: 'index',
      title: 'Home',
      path: '/',
      content: '<h1>Homepage</h1>',
      childIds: ['patterns', 'testcases']
    }),

    patterns: Factory.navigation('patterns', {
      itemId: 'patterns',
      title: 'Pattern Library',
      path: '/patterns/',
      parentId: 'index',
      childIds: ['patterns/input']
    }),

    'patterns/input': Factory.navigation('patterns/input', {
      itemId: 'input',
      title: 'Awesome Input',
      path: 'patterns/input',
      type: 'component',
      parentId: 'patterns'
    }),

    prototype: Factory.navigation('prototype', {
      itemId: 'prototype',
      title: 'Sandbox',
      path: 'prototype',
      parentId: 'index'
    }),

    'prototype/custom-page': Factory.navigation('prototype/custom-page', {
      itemId: 'prototype/custom-page',
      title: 'Custom Page',
      path: 'prototype/custom-page',
      type: 'page',
      template: 'page.pug',
      content: 'Content for custom template',
      context: {
        myContextVariable: 'This is my context'
      },
      parentId: 'prototype'
    }),

    testcases: Factory.navigation('testcases', {
      itemId: 'testcases',
      title: 'Testcases',
      path: 'testcases',
      parentId: 'index'
    }),

    'testcases/custom-path': Factory.navigation('testcases/custom-path', {
      itemId: 'testcases/custom-path',
      title: 'Custom Path',
      path: 'documentation',
      parentId: 'testcases'
    })
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
          context: { id: 'name', name: 'person[name]' },
          title: 'Text Input',
          themes: {
            _default: {
              rendered: '<input class="input input--text" id="name" name="person[name]" type="text"/>'
            }
          }
        },
        {
          id: 'input/number.pug',
          componentId: 'input',
          file: 'number.pug',
          path: resolve(testProjectPath, 'src', 'components', 'input', 'variants', 'number.pug'),
          template: 'page.pug', // custom template
          content: '<p>This is documentation for the number input.</p>',
          context: { id: 'amount', name: 'person[amount]' },
          title: 'Number Input',
          themes: {
            _default: {
              rendered: '<input class="input input--number" id="amount" name="person[amount]" type="text"/>'
            }
          }
        }
      ]
    })
  }
}

describe('Builder', () => {
  afterEach(() => { removeSync(testTmpPath) })

  describe('#generate', () => {
    it('should generate index page', async () => {
      await Builder.generate(state)

      assertExists(join(target, 'index.html'))
    })

    it('should generate the sketch page', async () => {
      await Builder.generate(state)

      assertExists(join(target, '_sketch', '_default.html'))
    })
  })

  describe('#generatePageWithTemplate', () => {
    it('should generate page with custom template', async () => {
      await Builder.generatePageWithTemplate(state, 'prototype/custom-page')

      const pagePath = join(target, '_pages', '_default', 'prototype', 'custom-page.html')
      assertContentMatches(pagePath, 'This is my context')
      assertContentMatches(pagePath, '<title>Page template</title>')
      assertContentDoesNotMatch(pagePath, 'uie-page uie-page--prototype-custom-page')
    })

    it('should generate page with custom fragment and default template', async () => {
      await Builder.generatePageWithTemplate(state, 'prototype/custom-page-with-fragment')

      const pagePath = join(target, '_pages', '_default', 'prototype', 'custom-page-with-fragment.html')
      assertContentMatches(pagePath, 'Page fragment')
      assertContentMatches(pagePath, 'This is my fragment')
      assertContentMatches(pagePath, '<title>Custom Page with Fragment • Builder Test (0.1.0)</title>')
      assertContentMatches(pagePath, 'uie-page uie-page--prototype-custom-page-with-fragment')
      assertContentDoesNotMatch(pagePath, 'This is my context')
    })

    it('should generate page with custom fragment and template', async () => {
      await Builder.generatePageWithTemplate(state, 'prototype/custom-page-with-fragment-and-template')

      const pagePath = join(target, '_pages', '_default', 'prototype', 'custom-page-with-fragment-and-template.html')
      assertContentMatches(pagePath, 'Page fragment')
      assertContentMatches(pagePath, 'This is my fragment')
      assertContentMatches(pagePath, 'This is my context')
      assertContentMatches(pagePath, '<title>Custom template</title>')
      assertContentDoesNotMatch(pagePath, 'uie-page uie-page--prototype-custom-page-with-fragment-and-template')
    })

    it('should throw error if the page does not exist', async () => {
      try {
        await Builder.generatePageWithTemplate(state, 'prototype/unknown-page')
      } catch (error) {
        assert(error)

        assertMatches(error.message, 'Page "prototype/unknown-page" does not exist or has not been fetched yet.')
      }
    })

    it('should throw error if the custom template does not exist', async () => {
      try {
        const erroneousState = Object.assign({}, state, {
          pages: {
            'prototype/custom-page-erroneous': Factory.page('prototype/custom-page-erroneous', {
              title: 'Custom Erroneous Page',
              template: 'doesnotexist.pug',
              content: 'Content for custom template that does not exist',
              context: {}
            })
          }
        })
        await Builder.generatePageWithTemplate(erroneousState, 'prototype/custom-page-erroneous')
      } catch (error) {
        assert(error)

        assertMatches(error.message, 'prototype/custom-page-erroneous could not be generated!')
      }
    })

    it('should throw error with additional debug output if the template cannot be rendered', async () => {
      try {
        const debugState = JSON.parse(JSON.stringify(state))
        debugState.config.debug = true
        debugState.pages['prototype/custom-page'].template = 'doesnotexist.pug'
        debugState.pages['prototype/custom-page'].context = { variable: 'Test' }
        await Builder.generatePageWithTemplate(debugState, 'prototype/custom-page')
      } catch (error) {
        assert(error)

        assertMatches(error.message, '"variable": "Test"')
      }
    })
  })

  describe('#generatePageWithTokens', () => {
    it('should generate page with tokens', async () => {
      await Builder.generatePageWithTokens(state, 'tokens')

      const pagePath = join(target, '_tokens', '_default', 'tokens.html')
      assertContentMatches(pagePath, '#123456')
    })

    it('should throw error if the page does not exist', async () => {
      try {
        await Builder.generatePageWithTokens(state, 'unknown-tokens')
      } catch (error) {
        assert(error)

        assertMatches(error.message, 'Page "unknown-tokens" does not exist or has not been fetched yet.')
      }
    })
  })

  describe('#generatePageFiles', () => {
    it('should copy page files', async () => {
      await Builder.generatePageFiles(state, 'testcases')

      assertExists(join(target, 'testcases', 'index.txt'))
      assertExists(join(target, 'testcases', 'extra-files', 'file-in-folder.txt'))
      assertExists(join(target, 'testcases', 'extra-files', 'subfolder', 'file-in-subfolder.txt'))
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

      assertExists(join(target, '_pages', '_default', 'prototype', 'custom-page.html'))
      assertDoesNotExist(join(target, '_pages', '_default', 'prototype', 'custom-page-with-fragment.html'))
      assertDoesNotExist(join(target, '_pages', '_default', 'prototype', 'custom-page-with-fragment-and-template.html'))
    })

    it('should generate pages having this fragment', async () => {
      await Builder.generatePagesWithTemplate(state, 'fragment.pug')

      assertExists(join(target, '_pages', '_default', 'prototype', 'custom-page-with-fragment.html'))
      assertExists(join(target, '_pages', '_default', 'prototype', 'custom-page-with-fragment-and-template.html'))
      assertDoesNotExist(join(target, '_pages', '_default', 'prototype', 'custom-page.html'))
    })
  })

  describe('#generateTokensWithTemplate', () => {
    it('should generate tokens using the default preview template', async () => {
      await Builder.generateTokensWithTemplate(state, 'uiengine.pug')

      assertExists(join(target, '_tokens', '_default', 'tokens.html'))
      assertDoesNotExist(join(target, '_tokens', '_default', 'tokens-with-custom-template.html'))
    })

    it('should generate tokens having a custom template', async () => {
      await Builder.generateTokensWithTemplate(state, 'page.pug')

      assertExists(join(target, '_tokens', '_default', 'tokens-with-custom-template.html'))
      assertDoesNotExist(join(target, '_tokens', '_default', 'tokens.html'))
    })
  })

  describe('#generateVariantsWithTemplate', () => {
    it('should generate variants using the default preview template', async () => {
      await Builder.generateVariantsWithTemplate(state, 'uiengine.pug')

      assertExists(join(target, '_variants', '_default', 'input', 'text.pug.html'))
      assertDoesNotExist(join(target, '_variants', '_default', 'input', 'number.pug.html'))
    })

    it('should generate variants having a custom template', async () => {
      await Builder.generateVariantsWithTemplate(state, 'page.pug')

      assertExists(join(target, '_variants', '_default', 'input', 'number.pug.html'))
      assertDoesNotExist(join(target, '_variants', '_default', 'input', 'text.pug.html'))
    })
  })

  describe('#generateComponentVariants', () => {
    it('should generate component variant pages', async () => {
      await Builder.generateComponentVariants(state, 'input')

      assertExists(join(target, '_variants', '_default', 'input', 'text.pug.html'))
    })

    it('should not throw an error if the component has no', async () => {
      const stateWithNoVariants = JSON.parse(JSON.stringify(state))
      delete stateWithNoVariants.components.input.variants
      await Builder.generateComponentVariants(stateWithNoVariants, 'input')

      assertDoesNotExist(join(target, '_variants', '_default', 'input', 'text.pug.html'))
    })
  })

  describe('#generateVariant', () => {
    it('should generate variant page', async () => {
      const variant = state.components.input.variants[0]
      const filePath = join(target, '_variants', '_default', 'input', 'text.pug.html')
      await Builder.generateVariant(state, variant)

      assertContentMatches(filePath, '<title>Awesome Input: Text Input • Builder Test (0.1.0)</title>')
      assertContentMatches(filePath, 'class="uie-variant uie-variant--input uie-variant--input-text-pug"')
      assertContentMatches(filePath, 'data-theme="_default"')
      assertContentMatches(filePath, '<input class="input input--text" id="name" name="person[name]" type="text"/>')
    })
  })

  describe('#generateIncrement', () => {
    describe('with debug level set', () => {
      it('should generate state file', async () => {
        const stateWithDebug = JSON.parse(JSON.stringify(state))
        stateWithDebug.config.debug = true

        await Builder.generateIncrement(stateWithDebug)

        assertExists(join(target, '_state.json'))
      })
    })
  })
})
