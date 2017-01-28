/* global after, before, describe, it */
const fs = require('fs-extra')
const path = require('path')
const Factory = require('./support/factory')
const assertFileExists = require('./support/assertFileExists')

const Builder = require('../lib/builder')
const Theme = require('../lib/theme')

const sitePath = './test/tmp/site'
const assetsPath = './test/tmp/assets'

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
    'index': Factory.page('index', { childIds: ['child1'] }),
    'child1': Factory.page('child1', { path: 'custom/page/path' })
  }
}

describe('Builder', () => {
  before(() => Theme.setup(state))
  after(() => Theme.teardown(state))

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
