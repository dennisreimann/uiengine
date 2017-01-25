/* global describe, it */
const assert = require('assert')
const fs = require('fs-extra')
const assertFileExists = require('./support/assertFileExists')

const UIengine = require('../lib/index')

const sitePath = './test/tmp/site'
const assetsPath = './test/tmp/assets'
const testConfigPath = './test/project/project.yml'

describe('UIengine', () => {
  describe('#generate', () => {
    afterEach(() => {
      fs.removeSync(sitePath)
      fs.removeSync(assetsPath)
    })

    it('should generate site', done => {
      const opts = { config: testConfigPath }

      UIengine.generate(opts)
        .then(state => {
          assertFileExists(`${sitePath}/index.html`)
          assertFileExists(`${sitePath}/childpage/path/explicit/index.html`)
          assertFileExists(`${sitePath}/child1/grandchild1/index.html`)
          assertFileExists(`${sitePath}/child2/index.html`)
          assertFileExists(`${sitePath}/child2/grandchild1/index.html`)
          assertFileExists(`${sitePath}/child2/grandchild2/index.html`)
          assertFileExists(`${sitePath}/index.html`)

          done()
        })
        .catch(done)
    })

    it('should copy theme assets', done => {
      const opts = { config: testConfigPath }

      UIengine.generate(opts)
        .then(state => {
          assertFileExists(`${assetsPath}/styles/main.css`)
          assertFileExists(`${assetsPath}/scripts/main.js`)

          done()
        })
        .catch(done)
    })

    it('should throw error if no config option is provided', done => {
      UIengine.generate()
        .catch(error => {
          assert(error)
          done()
        })
    })
  })
})
