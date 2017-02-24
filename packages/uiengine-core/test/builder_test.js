/* global afterEach, describe, it */
const fs = require('fs-extra')
const path = require('path')
const Factory = require('./support/factory')
const assertExists = require('./support/assertExists')

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
      components: path.resolve(projectPath, 'src', 'components'),
      templates: path.resolve(projectPath, 'src', 'templates'),
      pages: path.resolve(projectPath, 'src', 'pages')
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
      variation: 'variation-preview.pug'
    },
    theme: 'uiengine-theme-default'
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
    })
  },
  navigation: {
    'index': NavigationData('index', 'Home', '', [], null, ['patterns']),
    'patterns': NavigationData('patterns', 'Pattern Library', 'pattern-library', ['index'], 'index', { childIds: ['patterns/input'] }),
    'patterns/input': NavigationData('patterns/input', 'Awesome Input', 'pattern-library/input', ['index', 'patterns'], 'patterns')
  },
  components: {
    input: Factory.component('input', {
      title: 'Awesome Input',
      variationIds: ['input/text.pug'],
      content: '<p>An input field that can be used inside a form.</p>'
    })
  },
  variations: {
    'input/text.pug': {
      id: 'input/text.pug',
      componentId: 'input',
      path: path.resolve(projectPath, 'src', 'components', 'input', 'variations', 'text.pug'),
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
        .then(state => {
          assertExists(path.join(target, 'index.html'))
          assertExists(path.join(target, 'pattern-library', 'index.html'))

          done()
        })
        .catch(done)
    })
  })

  describe('#generatePage', () => {
    it('should generate page', done => {
      Builder.generatePage(state, 'index')
        .then(state => {
          assertExists(path.join(target, 'index.html'))

          done()
        })
        .catch(done)
    })

    it('should generate page with custom path', done => {
      Builder.generatePage(state, 'patterns')
        .then(state => {
          assertExists(path.join(target, 'pattern-library', 'index.html'))

          done()
        })
        .catch(done)
    })
  })

  describe('#copyPageFiles', () => {
    it('should copy page files', done => {
      Builder.copyPageFiles(state, 'index')
        .then(state => {
          assertExists(path.join(target, 'index.txt'))

          done()
        })
        .catch(done)
    })

    it('should copy page files in extra folder', done => {
      Builder.copyPageFiles(state, 'index')
        .then(state => {
          assertExists(path.join(target, 'extra-files', 'file-in-folder.txt'))

          done()
        })
        .catch(done)
    })

    it('should copy page files for pages with custom paths', done => {
      Builder.copyPageFiles(state, 'patterns')
        .then(state => {
          assertExists(path.join(target, 'pattern-library', 'patterns-file.txt'))

          done()
        })
        .catch(done)
    })

    it('should copy page files in extra folder for pages with custom paths', done => {
      Builder.copyPageFiles(state, 'patterns')
        .then(state => {
          assertExists(path.join(target, 'pattern-library', 'some-files', 'file-in-folder.txt'))

          done()
        })
        .catch(done)
    })
  })

  describe('#generateComponentForPage', () => {
    it('should generate component page', done => {
      Builder.generateComponentForPage(state, 'patterns', 'input')
        .then(state => {
          assertExists(path.join(target, 'pattern-library', 'input', 'index.html'))

          done()
        })
        .catch(done)
    })
  })

  describe('#generateComponentsForPage', () => {
    it('should generate component pages', done => {
      Builder.generateComponentsForPage(state, 'patterns')
        .then(state => {
          assertExists(path.join(target, 'pattern-library', 'input', 'index.html'))

          done()
        })
        .catch(done)
    })
  })

  describe('#generatePagesHavingComponent', () => {
    it('should generate pages having this component as subpage', done => {
      Builder.generatePagesHavingComponent(state, 'input')
        .then(state => {
          assertExists(path.join(target, 'pattern-library', 'input', 'index.html'))

          done()
        })
        .catch(done)
    })
  })

  describe('#generateComponentVariations', () => {
    it('should generate component variation pages', done => {
      Builder.generateComponentVariations(state, 'input')
        .then(state => {
          assertExists(path.join(target, 'variations', 'input', 'text.pug.html'))

          done()
        })
        .catch(done)
    })
  })

  describe('#generateVariation', () => {
    it('should generate variation page', done => {
      Builder.generateVariation(state, 'input/text.pug')
        .then(state => {
          assertExists(path.join(target, 'variations', 'input', 'text.pug.html'))

          done()
        })
        .catch(done)
    })
  })

  describe('#dumpState', () => {
    it('should generate state file', done => {
      Builder.dumpState(state)
        .then(state => {
          assertExists(path.join(target, 'state.json'))

          done()
        })
        .catch(done)
    })
  })
})
