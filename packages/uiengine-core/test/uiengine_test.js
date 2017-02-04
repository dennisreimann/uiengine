/* global describe, it */
const fs = require('fs-extra')
const path = require('path')
const assert = require('assert')
const assertFileExists = require('./support/assertFileExists')

const UIengine = require('../lib/uiengine')

const sitePath = path.resolve(__dirname, '..', 'sample_project', 'dist')
const assetsPath = path.resolve(__dirname, '..', 'sample_project', 'dist', 'assets')
const testConfigPath = path.resolve(__dirname, '..', 'sample_project', 'uiengine.yml')

// "end to end" tests
describe('UIengine', () => {
  describe('#generate', () => {
    afterEach(() => {
      fs.removeSync(sitePath)
      fs.removeSync(assetsPath)
    })

    it('should generate pages', done => {
      const opts = { config: testConfigPath }

      UIengine.generate(opts)
        .then(state => {
          assertFileExists(path.join(sitePath, 'index.html'))
          assertFileExists(path.join(sitePath, 'documentation', 'index.html'))
          assertFileExists(path.join(sitePath, 'pattern-library', 'index.html'))
          assertFileExists(path.join(sitePath, 'patterns', 'atoms', 'index.html'))
          assertFileExists(path.join(sitePath, 'patterns', 'molecules', 'index.html'))
          assertFileExists(path.join(sitePath, 'patterns', 'organisms', 'index.html'))
          assertFileExists(path.join(sitePath, 'patterns', 'templates', 'index.html'))
          assertFileExists(path.join(sitePath, 'patterns', 'pages', 'index.html'))

          done()
        })
        .catch(done)
    })

    it('should generate state file', done => {
      const opts = { config: testConfigPath }

      UIengine.generate(opts)
        .then(state => {
          assertFileExists(path.join(sitePath, 'state.json'))

          done()
        })
        .catch(done)
    })

    it('should generate variation previews', done => {
      const opts = { config: testConfigPath }

      UIengine.generate(opts)
        .then(state => {
          assertFileExists(path.join(sitePath, 'variations', 'form', 'form.html'))
          assertFileExists(path.join(sitePath, 'variations', 'formrow', 'text-with-label.html'))
          assertFileExists(path.join(sitePath, 'variations', 'formrow', 'text-without-label.html'))
          assertFileExists(path.join(sitePath, 'variations', 'input', 'number.html'))
          assertFileExists(path.join(sitePath, 'variations', 'input', 'text-disabled.html'))
          assertFileExists(path.join(sitePath, 'variations', 'input', 'text-required.html'))
          assertFileExists(path.join(sitePath, 'variations', 'input', 'text.html'))
          assertFileExists(path.join(sitePath, 'variations', 'label', 'label.html'))

          done()
        })
        .catch(done)
    })

    it('should copy theme assets', done => {
      const opts = { config: testConfigPath }

      UIengine.generate(opts)
        .then(state => {
          assertFileExists(path.join(assetsPath, 'styles', 'uiengine.css'))
          assertFileExists(path.join(assetsPath, 'scripts', 'uiengine.js'))

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
