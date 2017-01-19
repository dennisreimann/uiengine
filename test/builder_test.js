/* global after, before, describe, it */
const fs = require('fs-extra')
const Factory = require('./support/factory')
const assertFileExists = require('./support/assertFileExists')

const Builder = require('../lib/builder')
const Renderer = require('../lib/renderer')

const sitePath = './test/tmp/site'
const state = {
  config: {
    target: {
      site: sitePath
    },
    basedirs: {
      pages: './test/project/pages',
      theme: './test/fixtures/theme'
    }
  },
  pages: {
    'index': Factory.page('index', { children: ['child1'] }),
    'child1': Factory.page('child1', { path: 'custom/page/path' })
  }
}

describe('Builder', () => {
  before(done => { Renderer.setupContext(state).then(done) })
  after(done => { Renderer.teardownContext(state).then(done) })

  describe('#generateSite', () => {
    afterEach(() => { fs.removeSync(sitePath) })

    it('should generate site', done => {
      Builder.generateSite(state)
        .then(state => {
          assertFileExists(`${sitePath}/index.html`)
          assertFileExists(`${sitePath}/custom/page/path/index.html`)

          done()
        })
        .catch(done)
    })
  })

  describe('#generatePage', () => {
    afterEach(() => { fs.removeSync(sitePath) })

    it('should generate page', done => {
      Builder.generatePage(state, 'child1')
        .then(state => {
          assertFileExists(`${sitePath}/custom/page/path/index.html`)

          done()
        })
        .catch(done)
    })
  })
})
