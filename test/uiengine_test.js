/* global describe, it */
const fs = require('fs-extra')
const path = require('path')
const assert = require('assert')
const assertExists = require('./support/assertExists')

const UIengine = require('../lib/uiengine')

const sitePath = path.resolve(__dirname, '..', 'sample_project', 'dist')
const assetsPath = path.resolve(__dirname, '..', 'sample_project', 'dist', 'assets')
const testConfigPath = path.resolve(__dirname, '..', 'sample_project', 'uiengine.yml')
const opts = { config: testConfigPath }

// "end to end" tests
describe('UIengine', () => {
  describe('#generate', () => {
    afterEach(() => {
      fs.removeSync(sitePath)
      fs.removeSync(assetsPath)
    })

    it('should generate pages', done => {
      UIengine.generate(opts)
        .then(state => {
          assertExists(path.join(sitePath, 'index.html'))
          assertExists(path.join(sitePath, 'documentation', 'index.html'))
          assertExists(path.join(sitePath, 'pattern-library', 'index.html'))
          assertExists(path.join(sitePath, 'patterns', 'atoms', 'index.html'))
          assertExists(path.join(sitePath, 'patterns', 'molecules', 'index.html'))
          assertExists(path.join(sitePath, 'patterns', 'organisms', 'index.html'))
          assertExists(path.join(sitePath, 'patterns', 'templates', 'index.html'))
          assertExists(path.join(sitePath, 'patterns', 'pages', 'index.html'))

          done()
        })
        .catch(done)
    })

    it('should generate state file', done => {
      UIengine.generate(opts)
        .then(state => {
          assertExists(path.join(sitePath, 'state.json'))

          done()
        })
        .catch(done)
    })

    it('should generate variation previews', done => {
      UIengine.generate(opts)
        .then(state => {
          assertExists(path.join(sitePath, 'variations', 'form', 'form.pug.html'))
          assertExists(path.join(sitePath, 'variations', 'formrow', 'text-with-label.pug.html'))
          assertExists(path.join(sitePath, 'variations', 'formrow', 'text-without-label.pug.html'))
          assertExists(path.join(sitePath, 'variations', 'input', 'number.pug.html'))
          assertExists(path.join(sitePath, 'variations', 'input', 'text-disabled.pug.html'))
          assertExists(path.join(sitePath, 'variations', 'input', 'text-required.pug.html'))
          assertExists(path.join(sitePath, 'variations', 'input', 'text.pug.html'))
          assertExists(path.join(sitePath, 'variations', 'label', 'label.pug.html'))

          done()
        })
        .catch(done)
    })

    it('should copy theme assets', done => {
      UIengine.generate(opts)
        .then(state => {
          assertExists(path.join(assetsPath, 'styles'))
          assertExists(path.join(assetsPath, 'scripts'))

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
