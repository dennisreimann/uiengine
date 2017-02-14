/* global afterEach, describe, it */
const fs = require('fs-extra')
const path = require('path')
const assert = require('assert')
const assertExists = require('./support/assertExists')

const UIengine = require('../src/uiengine')

const pagesPath = path.resolve(__dirname, '..', 'sample_project', 'src', 'pages')
const componentsPath = path.resolve(__dirname, '..', 'sample_project', 'src', 'components')
const sitePath = path.resolve(__dirname, '..', 'sample_project', 'dist')
const assetsPath = path.resolve(__dirname, '..', 'sample_project', 'dist', 'assets')
const opts = { config: path.resolve(__dirname, '..', 'sample_project', 'uiengine.yml') }

// "end to end" tests
describe('UIengine', () => {
  afterEach(() => {
    fs.removeSync(sitePath)
    fs.removeSync(assetsPath)
  })

  describe('#generate', () => {
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
          assertExists(path.join(sitePath, 'variations', 'input', 'text.hbs.html'))
          assertExists(path.join(sitePath, 'variations', 'input', 'text.pug.html'))
          assertExists(path.join(sitePath, 'variations', 'label', 'label.hbs.html'))
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

  describe('#generateIncrementForChangedFile', () => {
    it('should generate page', done => {
      const filePath = path.join(pagesPath, 'patterns', 'page.md')

      UIengine.generateIncrementForChangedFile(opts, filePath)
        .then(result => {
          assertExists(path.join(sitePath, 'pattern-library', 'index.html'))

          assert.equal(result.type, 'page')
          assert.equal(result.item, 'patterns')
          assert.equal(result.file, 'sample_project/src/pages/patterns/page.md')

          done()
        })
        .catch(done)
    })

    it('should generate component', done => {
      const filePath = path.join(componentsPath, 'form', 'form.pug')

      UIengine.generateIncrementForChangedFile(opts, filePath)
        .then(result => {
          assertExists(path.join(sitePath, 'variations', 'form', 'form.pug.html'))

          assert.equal(result.type, 'component')
          assert.equal(result.item, 'form')
          assert.equal(result.file, 'sample_project/src/components/form/form.pug')

          done()
        })
        .catch(done)
    })

    it('should generate variation', done => {
      const filePath = path.join(componentsPath, 'form', 'variations', 'form.pug')

      UIengine.generateIncrementForChangedFile(opts, filePath)
        .then(result => {
          assertExists(path.join(sitePath, 'variations', 'form', 'form.pug.html'))

          assert.equal(result.type, 'variation')
          assert.equal(result.item, 'form/form.pug')
          assert.equal(result.file, 'sample_project/src/components/form/variations/form.pug')

          done()
        })
        .catch(done)
    })
  })
})
