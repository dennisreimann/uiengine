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
const statePath = path.join(testProjectTargetPath, '_state.json')
const opts = { config: path.resolve(testProjectPath, 'uiengine.yml'), debug: true }

// "end to end" tests
describe('UIengine', () => {
  afterEach(() => { fs.removeSync(testProjectTargetPath) })

  describe('#generate', () => {
    it('should generate index page', done => {
      UIengine.generate(opts)
        .then(state => {
          assertExists(path.join(testProjectTargetPath, 'index.html'))

          done()
        })
        .catch(done)
    })

    it('should generate state file', done => {
      UIengine.generate(opts)
        .then(state => {
          assertExists(path.join(testProjectTargetPath, '_state.json'))

          done()
        })
        .catch(done)
    })

    it('should generate state file with token list', done => {
      UIengine.generate(opts)
        .then(state => {
          assertContentMatches(statePath, '.5rem')
          assertContentMatches(statePath, '1rem')
          assertContentMatches(statePath, '1.5rem')
          assertContentMatches(statePath, '3rem')

          done()
        })
        .catch(done)
    })

    it('should generate state file with token categories', done => {
      UIengine.generate(opts)
        .then(state => {
          // categories
          assertContentMatches(statePath, 'Brand')
          assertContentMatches(statePath, 'Neutral')
          assertContentMatches(statePath, 'Text')
          assertContentMatches(statePath, 'Background')

          // token values
          assertContentMatches(statePath, 'Brand Primary')
          assertContentMatches(statePath, '#FF183E')
          assertContentMatches(statePath, 'Primary brand color')

          done()
        })
        .catch(done)
    })

    it('should generate variant previews', done => {
      UIengine.generate(opts)
        .then(state => {
          assertExists(path.join(testProjectTargetPath, '_variants', 'form', 'form.pug.html'))
          assertExists(path.join(testProjectTargetPath, '_variants', 'formfield', 'text-with-label.pug.html'))
          assertExists(path.join(testProjectTargetPath, '_variants', 'formfield', 'text-without-label.pug.html'))
          assertExists(path.join(testProjectTargetPath, '_variants', 'input', 'number.pug.html'))
          assertExists(path.join(testProjectTargetPath, '_variants', 'input', 'text-disabled.pug.html'))
          assertExists(path.join(testProjectTargetPath, '_variants', 'input', 'text-required.pug.html'))
          assertExists(path.join(testProjectTargetPath, '_variants', 'input', 'text.hbs.html'))
          assertExists(path.join(testProjectTargetPath, '_variants', 'input', 'text.pug.html'))
          assertExists(path.join(testProjectTargetPath, '_variants', 'label', 'label.hbs.html'))
          assertExists(path.join(testProjectTargetPath, '_variants', 'label', 'label.marko.html'))
          assertExists(path.join(testProjectTargetPath, '_variants', 'label', 'label.pug.html'))

          done()
        })
        .catch(done)
    })

    it('should copy theme assets', done => {
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

      fs.removeSync(statePath)

      UIengine.generateIncrementForFileChange(filePath, 'changed')
        .then(result => {
          assertContentMatches(statePath, 'patterns')

          assert.equal(result.action, 'changed')
          assert.equal(result.type, 'page')
          assert.equal(result.item, 'patterns')
          assert.equal(result.file, path.join(testProjectRelativePath, 'src/uiengine/pages/patterns/page.md'))

          done()
        })
        .catch(done)
    })

    it('should generate state file on change', done => {
      const filePath = path.join(pagesPath, 'page.md')

      fs.removeSync(statePath)

      UIengine.generateIncrementForFileChange(filePath, 'changed')
        .then(result => {
          assertExists(statePath)

          assert.equal(result.action, 'changed')
          assert.equal(result.type, 'page')
          assert.equal(result.item, 'index')
          assert.equal(result.file, path.join(testProjectRelativePath, 'src', 'uiengine', 'pages', 'page.md'))

          done()
        })
        .catch(done)
    })

    it('should copy page files on change', done => {
      const filePath = path.join(pagesPath, 'testcases', 'extra-files', 'file-in-folder.txt')

      UIengine.generateIncrementForFileChange(filePath, 'changed')
        .then(result => {
          assertExists(path.join(testProjectTargetPath, 'testcases', 'extra-files', 'file-in-folder.txt'))

          assert.equal(result.action, 'changed')
          assert.equal(result.type, 'page')
          assert.equal(result.item, 'testcases')
          assert.equal(result.file, path.join(testProjectRelativePath, 'src', 'uiengine', 'pages', 'testcases', 'extra-files', 'file-in-folder.txt'))

          done()
        })
        .catch(done)
    })

    it('should generate page on create', done => {
      const filePath = path.join(pagesPath, 'testcases', 'created', 'page.md')
      const fileDir = path.dirname(filePath)

      fs.mkdirsSync(fileDir)
      fs.writeFileSync(filePath, '---\ntitle: Created\ncomponents:\n- label\n---\nContent for created page.')

      UIengine.generateIncrementForFileChange(filePath, 'created')
        .then(result => {
          assertContentMatches(statePath, 'Content for created page.')

          assert.equal(result.action, 'created')
          assert.equal(result.type, 'page')
          assert.equal(result.item, 'testcases/created')
          assert.equal(result.file, path.join(testProjectRelativePath, 'src/uiengine/pages/testcases/created/page.md'))

          fs.removeSync(fileDir)

          done()
        })
        .catch(err => {
          fs.removeSync(fileDir)

          done(err)
        })
    })

    it('should generate page on delete', done => {
      const filePath = path.join(pagesPath, 'testcases', 'created', 'page.md')
      const fileDir = path.dirname(filePath)

      fs.mkdirsSync(fileDir)
      fs.writeFileSync(filePath, '---\ntitle: Created Page\n---\nContent for created page.')

      UIengine.generateIncrementForFileChange(filePath, 'created')
        .then(result => {
          assertContentMatches(statePath, 'Created Page')

          fs.removeSync(filePath)

          UIengine.generateIncrementForFileChange(filePath, 'deleted')
            .then(result => {
              assertContentDoesNotMatch(statePath, 'Created Page')

              assert.equal(result.action, 'deleted')
              assert.equal(result.type, 'page')
              assert.equal(result.item, 'testcases/created')
              assert.equal(result.file, path.join(testProjectRelativePath, 'src', 'uiengine', 'pages', 'testcases', 'created', 'page.md'))

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

    it('should generate schema update on change', done => {
      const filePath = path.join(schemaPath, 'Entity.yml')

      fs.removeSync(statePath)

      UIengine.generateIncrementForFileChange(filePath, 'changed')
        .then(result => {
          assertContentMatches(statePath, 'Entity')

          assert.equal(result.action, 'changed')
          assert.equal(result.type, 'schema')
          assert.equal(result.item, 'Entity')
          assert.equal(result.file, path.join(testProjectRelativePath, 'src', 'uiengine', 'schema', 'Entity.yml'))

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
          assert.equal(result.file, path.join(testProjectRelativePath, 'src', 'components', 'form', 'form.pug'))

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
          assert.equal(result.file, path.join(testProjectRelativePath, 'src', 'components', 'input', 'variants', 'text.md'))

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
          assert.equal(result.file, path.join(testProjectRelativePath, 'src', 'components', 'my-new-component', 'component.md'))

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
              assert.equal(result.file, path.join(testProjectRelativePath, 'src', 'components', 'my-new-component', 'component.md'))

              fs.removeSync(componentPath)

              UIengine.generateIncrementForFileChange(componentPath, 'deleted')
                .then(result => {
                  const state = UIengine.getState()
                  assert.equal(state.components['my-new-component'], null)

                  assert.equal(result.action, 'deleted')
                  assert.equal(result.type, 'component')
                  assert.equal(result.item, 'my-new-component')
                  assert.equal(result.file, path.join(testProjectRelativePath, 'src', 'components', 'my-new-component'))

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
      const existingVariantPath = path.join(testProjectTargetPath, '_variants', 'form', 'form.pug.html')

      fs.removeSync(existingVariantPath)
      fs.removeSync(statePath)

      UIengine.generateIncrementForFileChange(filePath, 'changed')
        .then(result => {
          assertExists(existingVariantPath)

          assert.equal(result.action, 'changed')
          assert.equal(result.type, 'variant')
          assert.equal(result.item, 'form/form.pug')
          assert.equal(result.file, path.join(testProjectRelativePath, 'src', 'components', 'form', 'variants', 'form.pug'))

          assertExists(statePath)
          done()
        })
        .catch(done)
    })

    it('should generate variant on create', done => {
      const filePath = path.join(componentsPath, 'form', 'variants', 'form-fieldsets.pug')

      fs.removeSync(statePath)
      fs.writeFileSync(filePath, 'p Test')

      UIengine.generateIncrementForFileChange(filePath, 'created')
        .then(result => {
          assertContentMatches(statePath, 'Form Fieldsets')

          assert.equal(result.action, 'created')
          assert.equal(result.type, 'variant')
          assert.equal(result.item, 'form/form-fieldsets.pug')
          assert.equal(result.file, path.join(testProjectRelativePath, 'src', 'components', 'form', 'variants', 'form-fieldsets.pug'))

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

      fs.removeSync(statePath)
      fs.writeFileSync(filePath, 'p Test')

      UIengine.generateIncrementForFileChange(filePath, 'created')
        .then(result => {
          assertContentMatches(statePath, 'Form Fieldsets')

          fs.removeSync(filePath)

          UIengine.generateIncrementForFileChange(filePath, 'deleted')
            .then(result => {
              assertContentDoesNotMatch(statePath, 'Form Fieldsets')

              assert.equal(result.action, 'deleted')
              assert.equal(result.type, 'variant')
              assert.equal(result.item, 'form/form-fieldsets.pug')
              assert.equal(result.file, path.join(testProjectRelativePath, 'src', 'components', 'form', 'variants', 'form-fieldsets.pug'))

              done()
            })
            .catch(done)
        })
        .catch(err => {
          fs.removeSync(filePath)

          done(err)
        })
    })

    it('should regenerate pages with template on change', done => {
      const filePath = path.join(pagesPath, 'testcases', 'custom-template', 'page.md')
      const templatePath = path.join(testProjectTargetPath, '_pages', 'testcases', 'custom-template.html')

      fs.removeSync(templatePath)

      UIengine.generateIncrementForFileChange(filePath, 'changed')
        .then(result => {
          assertExists(templatePath)

          assert.equal(result.action, 'changed')
          assert.equal(result.type, 'page')
          assert.equal(result.item, 'testcases/custom-template')
          assert.equal(result.file, path.join(testProjectRelativePath, 'src', 'uiengine', 'pages', 'testcases', 'custom-template', 'page.md'))

          done()
        })
        .catch(done)
    })

    it('should regenerate pages with template on template change', done => {
      const filePath = path.join(templatesPath, 'page.pug')
      const templatePath = path.join(testProjectTargetPath, '_pages', 'testcases', 'custom-template.html')

      fs.removeSync(templatePath)

      UIengine.generateIncrementForFileChange(filePath, 'changed')
        .then(result => {
          assertExists(templatePath)

          assert.equal(result.action, 'changed')
          assert.equal(result.type, 'template')
          assert.equal(result.item, 'page')
          assert.equal(result.file, path.join(testProjectRelativePath, 'src', 'templates', 'page.pug'))

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
    it('should return whether or not a generate is currently running', done => {
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
