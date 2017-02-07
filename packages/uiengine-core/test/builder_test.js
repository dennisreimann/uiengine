/* global describe, it */
const fs = require('fs-extra')
const path = require('path')
const Factory = require('./support/factory')
const assertFileExists = require('./support/assertFileExists')

const Builder = require('../lib/builder')
const NavigationData = require('../lib/data/navigation')
const ComponentData = require('../lib/data/component')
const VariationData = require('../lib/data/variation')

const templating = path.resolve(__dirname, '..', 'lib', 'templating', 'uiengine-templating-pug')
const theme = path.resolve(__dirname, '..', 'theme')
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
    theme,
    templating
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
      ['input/text'],
      {
        content: '<p>An input field that can be used inside a form.</p>',
        title: 'Input'
      }
    )
  },
  variations: {
    'input/text': VariationData(
      'input/text',
      'input',
      path.resolve(projectPath, 'src', 'components', 'input', 'variations', 'text.pug'),
      'include /input/input.pug\n\n+input(id, name)',
      { id: 'name', name: 'person[name]' },
      { title: 'Text Input' }
    )
  }
}

describe('Builder', () => {
  afterEach(() => { fs.removeSync(assetsPath) })

  describe('#generateSite', () => {
    it('should generate site', done => {
      Builder.generateSite(state)
        .then(state => {
          assertFileExists(path.join(sitePath, 'index.html'))
          assertFileExists(path.join(sitePath, 'pattern-library', 'index.html'))

          done()
        })
        .catch(done)
    })
  })

  describe('#generatePage', () => {
    it('should generate page', done => {
      Builder.generatePage(state, 'index')
        .then(state => {
          assertFileExists(path.join(sitePath, 'index.html'))

          done()
        })
        .catch(done)
    })

    it('should generate page with custom path', done => {
      Builder.generatePage(state, 'patterns')
        .then(state => {
          assertFileExists(path.join(sitePath, 'pattern-library', 'index.html'))

          done()
        })
        .catch(done)
    })

    it('should copy page files', done => {
      Builder.generatePage(state, 'index')
        .then(state => {
          assertFileExists(path.join(sitePath, 'index.txt'))

          done()
        })
        .catch(done)
    })

    it('should copy page files in extra folder', done => {
      Builder.generatePage(state, 'index')
        .then(state => {
          assertFileExists(path.join(sitePath, 'extra-files', 'file-in-folder.txt'))

          done()
        })
        .catch(done)
    })

    it('should copy page files for pages with custom paths', done => {
      Builder.generatePage(state, 'patterns')
        .then(state => {
          assertFileExists(path.join(sitePath, 'pattern-library', 'patterns-file.txt'))

          done()
        })
        .catch(done)
    })

    it('should copy page files in extra folder for pages with custom paths', done => {
      Builder.generatePage(state, 'patterns')
        .then(state => {
          assertFileExists(path.join(sitePath, 'pattern-library', 'some-files', 'file-in-folder.txt'))

          done()
        })
        .catch(done)
    })
  })

  describe('#generateVariation', () => {
    it('should generate variation page', done => {
      Builder.generateVariation(state, 'input/text')
        .then(state => {
          assertFileExists(path.join(sitePath, 'variations', 'input', 'text.html'))

          done()
        })
        .catch(done)
    })
  })

  describe('#dumpState', () => {
    it('should generate state file', done => {
      Builder.dumpState(state)
        .then(state => {
          assertFileExists(path.join(sitePath, 'state.json'))

          done()
        })
        .catch(done)
    })
  })
})
