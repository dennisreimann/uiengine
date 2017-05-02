/* global afterEach, describe, it */
const fs = require('fs-extra')
const path = require('path')
const Factory = require('./support/factory')
const assertExists = require('./support/assertExists')
const assertContentMatches = require('./support/assertContentMatches')
const Builder = require('../src/builder')
const NavigationData = require('../src/data/navigation')

const projectPath = path.resolve(__dirname, 'project')
const tmpPath = path.resolve(__dirname, 'tmp')
const target = path.resolve(tmpPath, 'site')

const state = {
  config: {
    name: 'Builder Test',
    version: '0.1.0',
    source: {
      base: projectPath,
      configFile: path.resolve(projectPath, 'uiengine.yml'),
      components: path.resolve(projectPath, 'src', 'components'),
      templates: path.resolve(projectPath, 'src', 'templates'),
      pages: path.resolve(projectPath, 'src', 'pages'),
      data: path.resolve(projectPath, 'src', 'data')
    },
    target,
    adapters: {
      pug: {
        module: 'uiengine-adapter-pug',
        options: {
          pretty: true,
          basedir: path.resolve(projectPath, 'src', 'components')
        }
      },
      jsx: {
        module: 'uiengine-adapter-react',
        options: {}
      },
      hbs: {
        module: 'uiengine-adapter-handlebars',
        options: {}
      }
    },
    templates: {
      variant: path.resolve(projectPath, 'src', 'templates', 'variant-preview.pug'),
      custom: path.resolve(projectPath, 'src', 'templates', 'other-page.pug'),
      page: path.resolve(projectPath, 'src', 'templates', 'page.pug')
    },
    theme: {
      module: 'uiengine-theme-default',
      options: {}
    }
  },
  pages: {
    index: Factory.page('index', {
      title: 'Home',
      childIds: ['patterns'],
      files: [
        path.resolve(projectPath, 'src', 'pages', 'extra-files', 'file-in-folder.txt'),
        path.resolve(projectPath, 'src', 'pages', 'index.txt')
      ]
    }),
    patterns: Factory.page('patterns', {
      title: 'Pattern Library',
      path: 'pattern-library',
      files: [
        path.resolve(projectPath, 'src', 'pages', 'patterns', 'patterns-file.txt'),
        path.resolve(projectPath, 'src', 'pages', 'patterns', 'some-files', 'file-in-folder.txt')
      ],
      componentIds: ['input']
    }),
    sandbox: Factory.page('sandbox', {
      title: 'Sandbox',
      path: 'sandbox',
      template: 'theme:sandbox',
      childIds: ['sandbox/custom-page']
    }),
    'sandbox/page': Factory.page('sandbox/page', {
      title: 'Page',
      template: 'page',
      content: 'Content for page template',
      context: {
        myContextVariable: 'This is my page template'
      }
    }),
    'sandbox/custom-page': Factory.page('sandbox/custom-page', {
      title: 'Custom Page',
      template: 'custom',
      content: 'Content for custom template',
      context: {
        myContextVariable: 'This is my context'
      }
    })
  },
  navigation: {
    'index': NavigationData('index', 'Home', '', [], null, ['patterns']),
    'patterns': NavigationData('patterns', 'Pattern Library', 'pattern-library', ['index'], 'index', { childIds: ['patterns/input'] }),
    'patterns/input': NavigationData('patterns/input', 'Awesome Input', 'pattern-library/input', ['index', 'patterns'], 'patterns'),
    'sandbox': NavigationData('sandbox', 'Sandbox', 'sandbox', ['index'], 'index'),
    'sandbox/custom-page': NavigationData('sandbox/custom-page', 'Custom Page', 'sandbox/custom-page', ['index', 'sandbox'], 'sandbox')
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
      path: path.resolve(projectPath, 'src', 'components', 'input', 'variants', 'text.pug'),
      content: '<p>This is documentation for the text input.</p>',
      rendered: '<input class="input input--text" id="name" name="person[name]" type="text"/>',
      context: { id: 'name', name: 'person[name]' },
      title: 'Text Input'
    }
  }
}

describe('Builder', () => {
  afterEach(() => { fs.removeSync(tmpPath) })

  describe('#generateSite', () => {
    it('should generate site', function (done) {
      this.timeout(3000)

      Builder.generateSite(state)
        .then(() => {
          assertExists(path.join(target, 'index.html'))
          assertExists(path.join(target, 'pattern-library', 'index.html'))
          assertExists(path.join(target, 'sandbox', 'index.html'))
          assertExists(path.join(target, 'sandbox', 'custom-page', 'index.html'))

          done()
        })
        .catch(done)
    })
  })

  describe('#generatePage', () => {
    it('should generate page', done => {
      Builder.generatePage(state, 'index')
        .then(() => {
          const pagePath = path.join(target, 'index.html')

          assertContentMatches(pagePath, '<title>Home • Builder Test')

          done()
        })
        .catch(done)
    })

    it('should generate page with custom path', done => {
      Builder.generatePage(state, 'patterns')
        .then(() => {
          const pagePath = path.join(target, 'pattern-library', 'index.html')

          assertContentMatches(pagePath, '<title>Pattern Library • Builder Test')

          done()
        })
        .catch(done)
    })

    it('should generate page with custom template', done => {
      Builder.generatePage(state, 'sandbox/custom-page')
        .then(() => {
          const pagePath = path.join(target, 'sandbox', 'custom-page', 'index.html')

          assertContentMatches(pagePath, /^This is the custom template<br\/>This is my context$/)

          done()
        })
        .catch(done)
    })

    it('should generate page with custom template which has the same name as a theme template', done => {
      Builder.generatePage(state, 'sandbox/page')
        .then(() => {
          const pagePath = path.join(target, 'sandbox', 'page', 'index.html')

          assertContentMatches(pagePath, /^This is my page template$/)

          done()
        })
        .catch(done)
    })
  })

  describe('#copyPageFiles', () => {
    it('should copy page files', done => {
      Builder.copyPageFiles(state, 'index')
        .then(() => {
          assertExists(path.join(target, 'index.txt'))

          done()
        })
        .catch(done)
    })

    it('should copy page files in extra folder', done => {
      Builder.copyPageFiles(state, 'index')
        .then(() => {
          assertExists(path.join(target, 'extra-files', 'file-in-folder.txt'))

          done()
        })
        .catch(done)
    })

    it('should copy page files for pages with custom paths', done => {
      Builder.copyPageFiles(state, 'patterns')
        .then(() => {
          assertExists(path.join(target, 'pattern-library', 'patterns-file.txt'))

          done()
        })
        .catch(done)
    })

    it('should copy page files in extra folder for pages with custom paths', done => {
      Builder.copyPageFiles(state, 'patterns')
        .then(() => {
          assertExists(path.join(target, 'pattern-library', 'some-files', 'file-in-folder.txt'))

          done()
        })
        .catch(done)
    })
  })

  describe('#generateComponentForPage', () => {
    it('should generate component page', done => {
      Builder.generateComponentForPage(state, 'patterns', 'input')
        .then(() => {
          assertExists(path.join(target, 'pattern-library', 'input', 'index.html'))

          done()
        })
        .catch(done)
    })
  })

  describe('#generateComponentsForPage', () => {
    it('should generate component pages', done => {
      Builder.generateComponentsForPage(state, 'patterns')
        .then(() => {
          assertExists(path.join(target, 'pattern-library', 'input', 'index.html'))

          done()
        })
        .catch(done)
    })
  })

  describe('#generatePagesHavingComponent', () => {
    it('should generate pages having this component as subpage', done => {
      Builder.generatePagesHavingComponent(state, 'input')
        .then(() => {
          assertExists(path.join(target, 'pattern-library', 'input', 'index.html'))

          done()
        })
        .catch(done)
    })
  })

  describe('#generatePagesHavingTemplate', () => {
    it('should generate pages having this template', done => {
      Builder.generatePagesHavingTemplate(state, 'custom')
        .then(() => {
          assertExists(path.join(target, 'sandbox', 'custom-page', 'index.html'))

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

  describe('#dumpState', () => {
    it('should generate state file', done => {
      Builder.dumpState(state)
        .then(() => {
          assertExists(path.join(target, 'state.json'))

          done()
        })
        .catch(done)
    })
  })
})
