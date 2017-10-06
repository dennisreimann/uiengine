require('mocha-sinon')()

const fs = require('fs-extra')
const path = require('path')
const assert = require('assert')
const assertExists = require('./support/assertExists')
const assertContentMatches = require('./support/assertContentMatches')
const assertContentDoesNotMatch = require('./support/assertContentDoesNotMatch')

const UIengine = require('../src/uiengine')

const { testProjectPath, testProjectRelativePath, testProjectTargetPath } = require('../../../test/support/paths')
const dataPath = path.resolve(testProjectPath, 'src', 'uiengine', 'data')
const pagesPath = path.resolve(testProjectPath, 'src', 'uiengine', 'pages')
const schemaPath = path.resolve(testProjectPath, 'src', 'uiengine', 'schema')
const componentsPath = path.resolve(testProjectPath, 'src', 'components')
const templatesPath = path.resolve(testProjectPath, 'src', 'templates')
const opts = { config: path.resolve(testProjectPath, 'uiengine.yml'), debug: true }

// "end to end" tests
describe('UIengine', () => {
  afterEach(() => { fs.removeSync(testProjectTargetPath) })

  describe('#generate', () => {
    it('should generate pages', function (done) {
      this.timeout(10000)

      UIengine.generate(opts)
        .then(state => {
          assertExists(path.join(testProjectTargetPath, 'index.html'))
          assertExists(path.join(testProjectTargetPath, 'documentation', 'index.html'))
          assertExists(path.join(testProjectTargetPath, 'pattern-library', 'index.html'))
          assertExists(path.join(testProjectTargetPath, 'patterns', 'atoms', 'index.html'))
          assertExists(path.join(testProjectTargetPath, 'patterns', 'molecules', 'index.html'))
          assertExists(path.join(testProjectTargetPath, 'patterns', 'organisms', 'index.html'))
          assertExists(path.join(testProjectTargetPath, 'patterns', 'templates', 'index.html'))
          assertExists(path.join(testProjectTargetPath, 'patterns', 'pages', 'index.html'))

          done()
        })
        .catch(done)
    })

    it('should generate state file', function (done) {
      this.timeout(10000)

      UIengine.generate(opts)
        .then(state => {
          assertExists(path.join(testProjectTargetPath, 'state.json'))

          done()
        })
        .catch(done)
    })

    it('should generate schema page', function (done) {
      this.timeout(10000)

      UIengine.generate(opts)
        .then(state => {
          assertExists(path.join(testProjectTargetPath, '_schema', 'index.html'))

          done()
        })
        .catch(done)
    })

    it('should generate tokens page with token list', function (done) {
      this.timeout(10000)

      UIengine.generate(opts)
        .then(state => {
          const pagePath = path.join(testProjectTargetPath, 'documentation', 'tokens', 'spaces', 'index.html')

          assertContentMatches(pagePath, '.5rem')
          assertContentMatches(pagePath, '1rem')
          assertContentMatches(pagePath, '1.5rem')
          assertContentMatches(pagePath, '3rem')

          done()
        })
        .catch(done)
    })

    it('should generate tokens page with token categories', function (done) {
      this.timeout(10000)

      UIengine.generate(opts)
        .then(state => {
          const pagePath = path.join(testProjectTargetPath, 'documentation', 'tokens', 'colors', 'index.html')
          // categories
          assertContentMatches(pagePath, 'Brand')
          assertContentMatches(pagePath, 'Neutral')
          assertContentMatches(pagePath, 'Text')
          assertContentMatches(pagePath, 'Background')

          // token values
          assertContentMatches(pagePath, 'Brand Primary')
          assertContentMatches(pagePath, '#FF183E')
          assertContentMatches(pagePath, 'Primary brand color')

          done()
        })
        .catch(done)
    })

    it('should generate variant previews', function (done) {
      this.timeout(10000)

      UIengine.generate(opts)
        .then(state => {
          assertExists(path.join(testProjectTargetPath, '_variants', 'form', 'form.pug.html'))
          assertExists(path.join(testProjectTargetPath, '_variants', 'formrow', 'text-with-label.pug.html'))
          assertExists(path.join(testProjectTargetPath, '_variants', 'formrow', 'text-without-label.pug.html'))
          assertExists(path.join(testProjectTargetPath, '_variants', 'input', 'number.pug.html'))
          assertExists(path.join(testProjectTargetPath, '_variants', 'input', 'text-disabled.pug.html'))
          assertExists(path.join(testProjectTargetPath, '_variants', 'input', 'text-required.pug.html'))
          assertExists(path.join(testProjectTargetPath, '_variants', 'input', 'text.hbs.html'))
          assertExists(path.join(testProjectTargetPath, '_variants', 'input', 'text.pug.html'))
          assertExists(path.join(testProjectTargetPath, '_variants', 'label', 'label.hbs.html'))
          assertExists(path.join(testProjectTargetPath, '_variants', 'label', 'label.pug.html'))

          done()
        })
        .catch(done)
    })

    it('should copy theme assets', function (done) {
      this.timeout(10000)
      const assetsPath = path.join(testProjectTargetPath, '_uiengine-theme')

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
          assertExists(path.join(testProjectTargetPath, 'pattern-library', 'index.html'))

          assert.equal(result.action, 'changed')
          assert.equal(result.type, 'page')
          assert.equal(result.item, 'patterns')
          assert.equal(result.file, path.join(testProjectRelativePath, 'src/uiengine/pages/patterns/page.md'))

          done()
        })
        .catch(done)
    })

    it('should generate index page on change', done => {
      const filePath = path.join(pagesPath, 'page.md')

      UIengine.generateIncrementForFileChange(filePath, 'changed')
        .then(result => {
          assertExists(path.join(testProjectTargetPath, 'index.html'))

          assert.equal(result.action, 'changed')
          assert.equal(result.type, 'page')
          assert.equal(result.item, 'index')
          assert.equal(result.file, path.join(testProjectRelativePath, 'src/uiengine/pages/page.md'))

          done()
        })
        .catch(done)
    })

    it('should generate page without direct parent on change', done => {
      const filePath = path.join(pagesPath, 'patterns', 'pages', 'ajax', 'layer', 'page.md')

      UIengine.generateIncrementForFileChange(filePath, 'changed')
        .then(result => {
          assertExists(path.join(testProjectTargetPath, 'patterns', 'pages', 'ajax', 'layer', 'index.html'))

          assert.equal(result.action, 'changed')
          assert.equal(result.type, 'page')
          assert.equal(result.item, 'patterns/pages/ajax/layer')
          assert.equal(result.file, path.join(testProjectRelativePath, 'src/uiengine/pages/patterns/pages/ajax/layer/page.md'))

          done()
        })
        .catch(done)
    })

    it('should copy page files on change', done => {
      const filePath = path.join(pagesPath, 'extra-files', 'file-in-folder.txt')

      UIengine.generateIncrementForFileChange(filePath, 'changed')
        .then(result => {
          assertExists(path.join(testProjectTargetPath, 'extra-files', 'file-in-folder.txt'))

          assert.equal(result.action, 'changed')
          assert.equal(result.type, 'page')
          assert.equal(result.item, 'index')
          assert.equal(result.file, path.join(testProjectRelativePath, 'src/uiengine/pages/extra-files/file-in-folder.txt'))

          done()
        })
        .catch(done)
    })

    it('should generate page on create', done => {
      const pagePath = path.join(testProjectTargetPath, 'documentation', 'created', 'index.html')
      const filePath = path.join(pagesPath, 'documentation', 'created', 'page.md')
      const fileDir = path.dirname(filePath)

      fs.mkdirsSync(fileDir)
      fs.writeFileSync(filePath, '---\ntitle: Created\ncomponents:\n- label\n---\nContent for created page.')

      UIengine.generateIncrementForFileChange(filePath, 'created')
        .then(result => {
          assertContentMatches(pagePath, 'Content for created page.')
          assertExists(path.join(testProjectTargetPath, 'documentation', 'created', 'label', 'index.html'))

          assert.equal(result.action, 'created')
          assert.equal(result.type, 'page')
          assert.equal(result.item, 'documentation/created')
          assert.equal(result.file, path.join(testProjectRelativePath, 'src/uiengine/pages/documentation/created/page.md'))

          fs.removeSync(fileDir)

          done()
        })
        .catch(err => {
          fs.removeSync(fileDir)

          done(err)
        })
    })

    it('should generate page on delete', done => {
      const parentPagePath = path.join(testProjectTargetPath, 'documentation', 'index.html')
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
              assert.equal(result.file, path.join(testProjectRelativePath, 'src/uiengine/pages/documentation/created/page.md'))

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

    it('should generate schema page on change', done => {
      const filePath = path.join(schemaPath, 'Entity.yml')

      UIengine.generateIncrementForFileChange(filePath, 'changed')
        .then(result => {
          assertExists(path.join(testProjectTargetPath, '_schema', 'index.html'))

          assert.equal(result.action, 'changed')
          assert.equal(result.type, 'page')
          assert.equal(result.item, 'schema')
          assert.equal(result.file, path.join(testProjectRelativePath, 'src/uiengine/schema/Entity.yml'))

          done()
        })
        .catch(done)
    })

    it('should generate component on change', done => {
      const filePath = path.join(componentsPath, 'form', 'form.pug')

      UIengine.generateIncrementForFileChange(filePath, 'changed')
        .then(result => {
          assertExists(path.join(testProjectTargetPath, '_variants', 'form', 'form.pug.html'))

          assert.equal(result.action, 'changed')
          assert.equal(result.type, 'component')
          assert.equal(result.item, 'form')
          assert.equal(result.file, path.join(testProjectRelativePath, '/src/components/form/form.pug'))

          done()
        })
        .catch(done)
    })

    it('should generate component on variant meta file change', done => {
      const filePath = path.join(componentsPath, 'input', 'variants', 'text.md')

      UIengine.generateIncrementForFileChange(filePath, 'changed')
        .then(result => {
          assertExists(path.join(testProjectTargetPath, '_variants', 'input', 'text.pug.html'))

          assert.equal(result.action, 'changed')
          assert.equal(result.type, 'component')
          assert.equal(result.item, 'input')
          assert.equal(result.file, path.join(testProjectRelativePath, 'src/components/input/variants/text.md'))

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
          assert.equal(result.file, path.join(testProjectRelativePath, 'src/components/my-new-component/component.md'))

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
              assert.equal(result.file, path.join(testProjectRelativePath, 'src/components/my-new-component/component.md'))

              fs.removeSync(componentPath)

              UIengine.generateIncrementForFileChange(componentPath, 'deleted')
                .then(result => {
                  const state = UIengine.getState()
                  assert.equal(state.components['my-new-component'], null)

                  assert.equal(result.action, 'deleted')
                  assert.equal(result.type, 'component')
                  assert.equal(result.item, 'my-new-component')
                  assert.equal(result.file, path.join(testProjectRelativePath, 'src/components/my-new-component'))

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

    it('should generate variant on change', done => {
      const filePath = path.join(componentsPath, 'form', 'variants', 'form.pug')
      const componentPath = path.join(testProjectTargetPath, 'patterns', 'organisms', 'form', 'index.html')
      const existingVariantPath = path.join(testProjectTargetPath, '_variants', 'form', 'form.pug.html')

      fs.removeSync(existingVariantPath)
      fs.removeSync(componentPath)

      UIengine.generateIncrementForFileChange(filePath, 'changed')
        .then(result => {
          assertExists(existingVariantPath)

          assert.equal(result.action, 'changed')
          assert.equal(result.type, 'variant')
          assert.equal(result.item, 'form/form.pug')
          assert.equal(result.file, path.join(testProjectRelativePath, 'src/components/form/variants/form.pug'))

          assertExists(componentPath)
          done()
        })
        .catch(done)
    })

    it('should generate variant on create', done => {
      const filePath = path.join(componentsPath, 'form', 'variants', 'form-fieldsets.pug')
      const componentPath = path.join(testProjectTargetPath, 'patterns', 'organisms', 'form', 'index.html')

      fs.removeSync(componentPath)
      fs.writeFileSync(filePath, 'p Test')

      UIengine.generateIncrementForFileChange(filePath, 'created')
        .then(result => {
          assertContentMatches(componentPath, '>Form Fieldsets</')
          assertExists(componentPath)

          assert.equal(result.action, 'created')
          assert.equal(result.type, 'variant')
          assert.equal(result.item, 'form/form-fieldsets.pug')
          assert.equal(result.file, path.join(testProjectRelativePath, 'src/components/form/variants/form-fieldsets.pug'))

          fs.removeSync(filePath)

          done()
        })
        .catch(err => {
          fs.removeSync(filePath)

          done(err)
        })
    })

    it('should generate variant on delete', done => {
      const filePath = path.join(componentsPath, 'form', 'variants', 'form-fieldsets.pug')
      const componentPath = path.join(testProjectTargetPath, 'patterns', 'organisms', 'form', 'index.html')

      fs.writeFileSync(filePath, 'p Test')

      UIengine.generateIncrementForFileChange(filePath, 'created')
        .then(result => {
          assertContentMatches(componentPath, '>Form Fieldsets</')

          fs.removeSync(filePath)

          UIengine.generateIncrementForFileChange(filePath, 'deleted')
            .then(result => {
              assertContentDoesNotMatch(componentPath, '>Form Fieldsets</')

              assert.equal(result.action, 'deleted')
              assert.equal(result.type, 'variant')
              assert.equal(result.item, 'form/form-fieldsets.pug')
              assert.equal(result.file, path.join(testProjectRelativePath, 'src/components/form/variants/form-fieldsets.pug'))

              done()
            })
            .catch(done)
        })
        .catch(err => {
          fs.removeSync(filePath)

          done(err)
        })
    })

    it('should regenerate pages with template on template change', done => {
      const filePath = path.join(templatesPath, 'page.pug')

      UIengine.generateIncrementForFileChange(filePath, 'changed')
        .then(result => {
          assertExists(path.join(testProjectTargetPath, 'documentation', 'custom-template', 'index.html'))

          assert.equal(result.action, 'changed')
          assert.equal(result.type, 'template')
          assert.equal(result.item, 'page')
          assert.equal(result.file, path.join(testProjectRelativePath, 'src/templates/page.pug'))

          done()
        })
        .catch(done)
    })

    it('should regenerate content on data change', done => {
      const filePath = path.join(dataPath, 'items.yml')

      UIengine.generateIncrementForFileChange(filePath, 'changed')
        .then(result => {
          assertExists(path.join(testProjectTargetPath, 'index.html'))

          assert.equal(result.action, 'changed')
          assert.equal(result.type, 'site')
          assert.equal(result.item, 'UIengine Sample Project')
          assert.equal(result.file, path.join(testProjectRelativePath, 'src/uiengine/data/items.yml'))

          done()
        })
        .catch(done)
    })

    it('should regenerate everything on theme file change', done => {
      const filePath = path.resolve(testProjectPath, 'node_modules', 'uiengine-theme-default', 'lib', 'index.js')

      UIengine.generateIncrementForFileChange(filePath, 'changed')
        .then(result => {
          assertExists(path.join(testProjectTargetPath, 'index.html'))

          assert.equal(result.action, 'changed')
          assert.equal(result.type, 'site')
          assert.equal(result.item, 'UIengine Sample Project')
          assert.equal(result.file, path.join(testProjectRelativePath, 'node_modules/uiengine-theme-default/lib/index.js'))

          done()
        })
        .catch(done)
    })
  })

  describe('#isGenerating', () => {
    it('should return whether or not a generate is currently running', function (done) {
      this.timeout(10000)

      assert(!UIengine.isGenerating())

      UIengine.generate(opts)
        .then(state => {
          assert(!UIengine.isGenerating())

          done()
        })
        .catch(done)

      assert(UIengine.isGenerating())
    })
  })

  describe('#gulp', () => {
    it('should return a module to invoke gulp', function () {
      const fn = function () {}
      const gulp = { task: fn, watch: fn }
      this.sinon.stub(gulp, 'task')
      this.sinon.stub(gulp, 'watch').returns({ on: fn })

      const uiGulp = UIengine.integrations.gulp(gulp, opts)

      uiGulp.task('patterns')
      assert(gulp.task.calledOnce)
      assert(gulp.task.calledWith('patterns'))

      uiGulp.watch()
      assert(gulp.watch.calledOnce)
    })
  })
})
