/* global afterEach, describe, it */
const fs = require('fs-extra')
const path = require('path')
const Factory = require('./support/factory')
const assertExists = require('./support/assertExists')

const Builder = require('../src/builder')
const NavigationData = require('../src/data/navigation')
const ComponentData = require('../src/data/component')
const VariationData = require('../src/data/variation')

const projectPath = path.resolve(__dirname, '..', 'sample_project')
const tmpPath = path.resolve(__dirname, 'tmp')
const sitePath = path.resolve(tmpPath, 'site')
const assetsPath = path.resolve(tmpPath, 'site', 'assets')

const state = {
  config: {
    name: 'Builder Test',
    version: '0.1.0',
    target: {
      site: sitePath,
      assets: assetsPath
    },
    source: {
      components: path.resolve(projectPath, 'src', 'components'),
      templates: path.resolve(projectPath, 'src', 'templates'),
      pages: path.resolve(projectPath, 'src', 'pages')
    },
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
      childIds: ['patterns'],
      files: [
        path.resolve(projectPath, 'src', 'pages', 'extra-files', 'file-in-folder.txt'),
        path.resolve(projectPath, 'src', 'pages', 'index.txt')
      ]
    }),
    patterns: Factory.page('patterns', {
      path: 'pattern-library',
      files: [
        path.resolve(projectPath, 'src', 'pages', 'patterns', 'patterns-file.txt'),
        path.resolve(projectPath, 'src', 'pages', 'patterns', 'some-files', 'file-in-folder.txt')
      ]
    })
  },
  navigation: {
    index: NavigationData('index', null, [], ['patterns']),
    patterns: NavigationData('patterns', 'index', ['index'])
  },
  components: {
    input: ComponentData(
      'input',
      path.resolve(projectPath, 'src', 'components', 'input'),
      ['input/text.pug'],
      {
        content: '<p>An input field that can be used inside a form.</p>',
        title: 'Input'
      }
    )
  },
  variations: {
    'input/text.pug': VariationData(
      'input/text.pug',
      'input',
      path.resolve(projectPath, 'src', 'components', 'input', 'variations', 'text.pug'),
      '<p>This is documentation for the text input.</p>',
      { id: 'name', name: 'person[name]' },
      { title: 'Text Input' }
    )
  }
}

void fs

describe('Builder', () => {
  // afterEach(() => { fs.removeSync(tmpPath) })

  describe('#generateSite', () => {
    it('should generate site', done => {
      Builder.generateSite(state)
        .then(state => {
          assertExists(path.join(sitePath, 'index.html'))
          assertExists(path.join(sitePath, 'pattern-library', 'index.html'))

          done()
        })
        .catch(done)
    })
  })

  describe('#generatePage', () => {
    it('should generate page', done => {
      Builder.generatePage(state, 'index')
        .then(state => {
          assertExists(path.join(sitePath, 'index.html'))

          done()
        })
        .catch(done)
    })

    it('should generate page with custom path', done => {
      Builder.generatePage(state, 'patterns')
        .then(state => {
          assertExists(path.join(sitePath, 'pattern-library', 'index.html'))

          done()
        })
        .catch(done)
    })

    it('should copy page files', done => {
      Builder.generatePage(state, 'index')
        .then(state => {
          assertExists(path.join(sitePath, 'index.txt'))

          done()
        })
        .catch(done)
    })

    it('should copy page files in extra folder', done => {
      Builder.generatePage(state, 'index')
        .then(state => {
          assertExists(path.join(sitePath, 'extra-files', 'file-in-folder.txt'))

          done()
        })
        .catch(done)
    })

    it('should copy page files for pages with custom paths', done => {
      Builder.generatePage(state, 'patterns')
        .then(state => {
          assertExists(path.join(sitePath, 'pattern-library', 'patterns-file.txt'))

          done()
        })
        .catch(done)
    })

    it('should copy page files in extra folder for pages with custom paths', done => {
      Builder.generatePage(state, 'patterns')
        .then(state => {
          assertExists(path.join(sitePath, 'pattern-library', 'some-files', 'file-in-folder.txt'))

          done()
        })
        .catch(done)
    })
  })

  describe('#generateVariation', () => {
    it('should generate variation page', done => {
      Builder.generateVariation(state, 'input/text.pug')
        .then(state => {
          assertExists(path.join(sitePath, 'variations', 'input', 'text.pug.html'))

          done()
        })
        .catch(done)
    })
  })

  describe('#dumpState', () => {
    it('should generate state file', done => {
      Builder.dumpState(state)
        .then(state => {
          assertExists(path.join(sitePath, 'state.json'))

          done()
        })
        .catch(done)
    })
  })
})
