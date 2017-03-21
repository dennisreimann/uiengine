/* global afterEach, beforeEach, describe, it */
const fs = require('fs-extra')
const path = require('path')
const assert = require('assert')
const assertExists = require('./support/assertExists')
const assertContentMatches = require('./support/assertContentMatches')
const assertContentDoesNotMatch = require('./support/assertContentDoesNotMatch')

const UIengine = require('../src/uiengine')

const pagesPath = path.resolve(__dirname, 'project', 'src', 'pages')
const componentsPath = path.resolve(__dirname, 'project', 'src', 'components')
const targetPath = path.resolve(__dirname, 'project', 'dist')
const opts = { config: path.resolve(__dirname, 'project', 'uiengine.yml') }

// "end to end" tests
describe('UIengine', () => {
  afterEach(() => { fs.removeSync(targetPath) })

  describe('#generate', () => {
    it('should generate pages', function (done) {
      this.timeout(3000)

      UIengine.generate(opts)
        .then(state => {
          assertExists(path.join(targetPath, 'index.html'))
          assertExists(path.join(targetPath, 'documentation', 'index.html'))
          assertExists(path.join(targetPath, 'pattern-library', 'index.html'))
          assertExists(path.join(targetPath, 'patterns', 'atoms', 'index.html'))
          assertExists(path.join(targetPath, 'patterns', 'molecules', 'index.html'))
          assertExists(path.join(targetPath, 'patterns', 'organisms', 'index.html'))
          assertExists(path.join(targetPath, 'patterns', 'templates', 'index.html'))
          assertExists(path.join(targetPath, 'patterns', 'pages', 'index.html'))

          done()
        })
        .catch(done)
    })

    it('should generate state file', done => {
      UIengine.generate(opts)
        .then(state => {
          assertExists(path.join(targetPath, 'state.json'))

          done()
        })
        .catch(done)
    })

    it('should generate variation previews', done => {
      UIengine.generate(opts)
        .then(state => {
          assertExists(path.join(targetPath, 'variations', 'form', 'form.pug.html'))
          assertExists(path.join(targetPath, 'variations', 'formrow', 'text-with-label.pug.html'))
          assertExists(path.join(targetPath, 'variations', 'formrow', 'text-without-label.pug.html'))
          assertExists(path.join(targetPath, 'variations', 'input', 'number.pug.html'))
          assertExists(path.join(targetPath, 'variations', 'input', 'text-disabled.pug.html'))
          assertExists(path.join(targetPath, 'variations', 'input', 'text-required.pug.html'))
          assertExists(path.join(targetPath, 'variations', 'input', 'text.hbs.html'))
          assertExists(path.join(targetPath, 'variations', 'input', 'text.pug.html'))
          assertExists(path.join(targetPath, 'variations', 'label', 'label.hbs.html'))
          assertExists(path.join(targetPath, 'variations', 'label', 'label.pug.html'))

          done()
        })
        .catch(done)
    })

    it('should copy theme assets', done => {
      const assetsPath = path.join(targetPath, '_uiengine-theme')

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

  describe('#generateIncrementForFileChange', () => {
    it('should generate page on change', done => {
      const filePath = path.join(pagesPath, 'patterns', 'page.md')

      UIengine.generateIncrementForFileChange(filePath, 'changed')
        .then(result => {
          assertExists(path.join(targetPath, 'pattern-library', 'index.html'))

          assert.equal(result.action, 'changed')
          assert.equal(result.type, 'page')
          assert.equal(result.item, 'patterns')
          assert.equal(result.file, 'test/project/src/pages/patterns/page.md')

          done()
        })
        .catch(done)
    })

    it('should generate page on create', done => {
      const pagePath = path.join(targetPath, 'documentation', 'created', 'index.html')
      const filePath = path.join(pagesPath, 'documentation', 'created', 'page.md')
      const fileDir = path.dirname(filePath)

      fs.mkdirsSync(fileDir)
      fs.writeFileSync(filePath, '---\ntitle: Created\ncomponents:\n- label\n---\nContent for created page.')

      UIengine.generateIncrementForFileChange(filePath, 'created')
        .then(result => {
          assertContentMatches(pagePath, 'Content for created page.')
          assertExists(path.join(targetPath, 'documentation', 'created', 'label', 'index.html'))

          assert.equal(result.action, 'created')
          assert.equal(result.type, 'page')
          assert.equal(result.item, 'documentation/created')
          assert.equal(result.file, 'test/project/src/pages/documentation/created/page.md')

          fs.removeSync(fileDir)

          done()
        })
        .catch(err => {
          fs.removeSync(fileDir)

          done(err)
        })
    })

    it('should generate page on delete', done => {
      const parentPagePath = path.join(targetPath, 'documentation', 'index.html')
      const filePath = path.join(pagesPath, 'documentation', 'created', 'page.md')
      const fileDir = path.dirname(filePath)

      fs.mkdirsSync(fileDir)
      fs.writeFileSync(filePath, '---\ntitle: Created Page\n---\nContent for created page.')

      UIengine.generateIncrementForFileChange(filePath, 'created')
        .then(result => {
          assertContentMatches(parentPagePath, 'Created Page')

          fs.removeSync(filePath)

          UIengine.generateIncrementForFileChange(filePath, 'deleted')
            .then(result => {
              assertContentDoesNotMatch(parentPagePath, 'Created Page')

              assert.equal(result.action, 'deleted')
              assert.equal(result.type, 'page')
              assert.equal(result.item, 'documentation/created')
              assert.equal(result.file, 'test/project/src/pages/documentation/created/page.md')

              fs.removeSync(fileDir)

              done()
            })
            .catch(err => {
              fs.removeSync(fileDir)

              done(err)
            })
        })
        .catch(err => {
          fs.removeSync(fileDir)

          done(err)
        })
    })

    it('should generate component on change', done => {
      const filePath = path.join(componentsPath, 'form', 'form.pug')

      UIengine.generateIncrementForFileChange(filePath, 'changed')
        .then(result => {
          assertExists(path.join(targetPath, 'variations', 'form', 'form.pug.html'))

          assert.equal(result.action, 'changed')
          assert.equal(result.type, 'component')
          assert.equal(result.item, 'form')
          assert.equal(result.file, 'test/project/src/components/form/form.pug')

          done()
        })
        .catch(done)
    })

    it('should generate component on create', done => {
      const componentPath = path.join(componentsPath, 'my-new-component')
      const filePath = path.join(componentPath, 'component.md')
      const fileDir = path.dirname(filePath)

      fs.mkdirsSync(fileDir)
      fs.writeFileSync(filePath, '---\ntitle: New component\n---\n')

      UIengine.generateIncrementForFileChange(filePath, 'created')
        .then(result => {
          const state = UIengine.getState()
          assert.equal(state.components['my-new-component'].title, 'New component')

          assert.equal(result.action, 'created')
          assert.equal(result.type, 'component')
          assert.equal(result.item, 'my-new-component')
          assert.equal(result.file, 'test/project/src/components/my-new-component/component.md')

          fs.removeSync(fileDir)

          done()
        })
        .catch(err => {
          fs.removeSync(fileDir)

          done(err)
        })
    })

    it('should generate component on delete', done => {
      const componentPath = path.join(componentsPath, 'my-new-component')
      const filePath = path.join(componentPath, 'component.md')

      fs.mkdirsSync(componentPath)
      fs.writeFileSync(filePath, '---\ntitle: New component\n---\n')

      UIengine.generateIncrementForFileChange(filePath, 'created')
        .then(result => {
          const state = UIengine.getState()
          assert.equal(state.components['my-new-component'].title, 'New component')

          fs.removeSync(filePath)

          UIengine.generateIncrementForFileChange(filePath, 'deleted')
            .then(result => {
              const state = UIengine.getState()
              assert.equal(state.components['my-new-component'].title, 'My New Component')

              assert.equal(result.action, 'deleted')
              assert.equal(result.type, 'component')
              assert.equal(result.item, 'my-new-component')
              assert.equal(result.file, 'test/project/src/components/my-new-component/component.md')

              fs.removeSync(componentPath)

              UIengine.generateIncrementForFileChange(componentPath, 'deleted')
                .then(result => {
                  const state = UIengine.getState()
                  assert.equal(state.components['my-new-component'], null)

                  assert.equal(result.action, 'deleted')
                  assert.equal(result.type, 'component')
                  assert.equal(result.item, 'my-new-component')
                  assert.equal(result.file, 'test/project/src/components/my-new-component')

                  fs.removeSync(componentPath)

                  done()
                })
                .catch(err => {
                  fs.removeSync(componentPath)

                  done(err)
                })
            })
            .catch(err => {
              fs.removeSync(componentPath)

              done(err)
            })
        })
        .catch(err => {
          fs.removeSync(componentPath)

          done(err)
        })
    })

    it('should generate variation on change', done => {
      const filePath = path.join(componentsPath, 'form', 'variations', 'form.pug')
      const componentPath = path.join(targetPath, 'patterns', 'organisms', 'form', 'index.html')
      const existingVariationPath = path.join(targetPath, 'variations', 'form', 'form.pug.html')

      fs.removeSync(existingVariationPath)
      fs.removeSync(componentPath)

      UIengine.generateIncrementForFileChange(filePath, 'changed')
        .then(result => {
          assertExists(existingVariationPath)

          assert.equal(result.action, 'changed')
          assert.equal(result.type, 'variation')
          assert.equal(result.item, 'form/form.pug')
          assert.equal(result.file, 'test/project/src/components/form/variations/form.pug')

          assertExists(componentPath)
          done()
        })
        .catch(done)
    })

    it('should generate variation on create', done => {
      const filePath = path.join(componentsPath, 'form', 'variations', 'form-fieldsets.pug')
      const componentPath = path.join(targetPath, 'patterns', 'organisms', 'form', 'index.html')

      fs.removeSync(componentPath)
      fs.writeFileSync(filePath, 'p Test')

      UIengine.generateIncrementForFileChange(filePath, 'created')
        .then(result => {
          assertContentMatches(componentPath, '<span class="variationheader__variation-title">Form Fieldsets</span>')
          assertExists(componentPath)

          assert.equal(result.action, 'created')
          assert.equal(result.type, 'variation')
          assert.equal(result.item, 'form/form-fieldsets.pug')
          assert.equal(result.file, 'test/project/src/components/form/variations/form-fieldsets.pug')

          fs.removeSync(filePath)

          done()
        })
        .catch(err => {
          fs.removeSync(filePath)

          done(err)
        })
    })

    it('should generate variation on delete', done => {
      const filePath = path.join(componentsPath, 'form', 'variations', 'form-fieldsets.pug')
      const componentPath = path.join(targetPath, 'patterns', 'organisms', 'form', 'index.html')

      fs.writeFileSync(filePath, 'p Test')

      UIengine.generateIncrementForFileChange(filePath, 'created')
        .then(result => {
          assertContentMatches(componentPath, '<span class="variationheader__variation-title">Form Fieldsets</span>')

          fs.removeSync(filePath)

          UIengine.generateIncrementForFileChange(filePath, 'deleted')
            .then(result => {
              assertContentDoesNotMatch(componentPath, '<span class="variationheader__variation-title">Form Fieldsets</span>')

              assert.equal(result.action, 'deleted')
              assert.equal(result.type, 'variation')
              assert.equal(result.item, 'form/form-fieldsets.pug')
              assert.equal(result.file, 'test/project/src/components/form/variations/form-fieldsets.pug')

              done()
            })
            .catch(done)
        })
        .catch(err => {
          fs.removeSync(filePath)

          done(err)
        })
    })
  })
})
