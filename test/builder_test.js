/* global describe, it */
const fs = require('fs-extra')
const path = require('path')
const Factory = require('./support/factory')
const assertFileExists = require('./support/assertFileExists')

const Builder = require('../lib/builder')

const tmpPath = path.resolve(__dirname, 'tmp')
const sitePath = path.resolve(tmpPath, 'site')
const assetsPath = path.resolve(tmpPath, 'site/assets')

const state = {
  config: {
    target: {
      site: sitePath,
      assets: assetsPath
    },
    source: {
      pages: path.resolve(__dirname, '../sample_project/pages')
    },
    theme: path.resolve(__dirname, '../sample_project/theme')
  },
  pages: {
    'index': Factory.page('index', {
      childIds: ['patterns'],
      files: [path.resolve(__dirname, '../sample_project/pages/index.txt')]
    }),
    'patterns': Factory.page('patterns', {
      path: 'pattern-library',
      files: [path.resolve(__dirname, '../sample_project/pages/patterns/patterns-file.txt')]
    })
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

    it('should copy page files for pages with custom paths', done => {
      Builder.generatePage(state, 'patterns')
        .then(state => {
          assertFileExists(path.join(sitePath, 'pattern-library', 'patterns-file.txt'))

          done()
        })
        .catch(done)
    })
  })
})
