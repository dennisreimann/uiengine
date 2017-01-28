/* global describe, it */
const fs = require('fs-extra')
const path = require('path')
const assert = require('assert')
const assertFileExists = require('./support/assertFileExists')

const UIengine = require('../lib/uiengine')

const sitePath = path.resolve(__dirname, '../sample_project/dist')
const assetsPath = path.resolve(__dirname, '../sample_project/dist/assets')
const testConfigPath = path.resolve(__dirname, '../sample_project/uiengine.yml')

// "end to end" tests
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
          assertFileExists(`${sitePath}/documentation/index.html`)
          assertFileExists(`${sitePath}/pattern-library/index.html`)
          assertFileExists(`${sitePath}/patterns/atoms/index.html`)
          assertFileExists(`${sitePath}/patterns/molecules/index.html`)
          assertFileExists(`${sitePath}/patterns/organisms/index.html`)
          assertFileExists(`${sitePath}/patterns/templates/index.html`)
          assertFileExists(`${sitePath}/patterns/pages/index.html`)

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
