require('mocha-sinon')()

const fs = require('fs-extra')
const path = require('path')
const assert = require('assert')
const assertExists = require('../../../test/support/assertExists')
const assertContentMatches = require('../../../test/support/assertContentMatches')
const assertContentDoesNotMatch = require('../../../test/support/assertContentDoesNotMatch')

const Core = require('../src/core')

const { testProjectPath, testProjectRelativePath, testProjectTargetPath } = require('../../../test/support/paths')
const dataPath = path.resolve(testProjectPath, 'src', 'uiengine', 'data')
const pagesPath = path.resolve(testProjectPath, 'src', 'uiengine', 'pages')
const schemaPath = path.resolve(testProjectPath, 'src', 'uiengine', 'schema')
const componentsPath = path.resolve(testProjectPath, 'src', 'components')
const templatesPath = path.resolve(testProjectPath, 'src', 'templates')
const indexPath = path.join(testProjectTargetPath, 'index.html')
const opts = { config: path.resolve(testProjectPath, 'uiengine.yml') }

// "end to end" tests
describe('Core', function () {
  this.timeout(5000)

  afterEach(() => { fs.removeSync(testProjectTargetPath) })

  describe('#generate', () => {
    it('should generate index page', done => {
      Core.generate(opts)
        .then(state => {
          assertExists(indexPath)

          // containing token list
          assertContentMatches(indexPath, '.5rem')
          assertContentMatches(indexPath, '1rem')
          assertContentMatches(indexPath, '1.5rem')
          assertContentMatches(indexPath, '3rem')

          // containing token categories
          assertContentMatches(indexPath, 'Brand')
          assertContentMatches(indexPath, 'Neutral')
          assertContentMatches(indexPath, 'Text')
          assertContentMatches(indexPath, 'Background')

          // containing token values
          assertContentMatches(indexPath, 'Brand Primary')
          assertContentMatches(indexPath, '#FF183E')
          assertContentMatches(indexPath, 'Primary brand color')

          done()
        })
        .catch(done)
    })

    describe('with debug level set', () => {
      it('should generate state file', done => {
        const optsWithDebug = Object.assign({}, opts, { debug: true })

        Core.generate(optsWithDebug)
          .then(state => {
            assertExists(path.join(testProjectTargetPath, '_state.json'))

            done()
          })
          .catch(done)
      })
    })

    it('should generate variant previews', done => {
      Core.generate(opts)
        .then(state => {
          assertExists(path.join(testProjectTargetPath, '_variants', 'form', 'form.pug.html'))
          assertExists(path.join(testProjectTargetPath, '_variants', 'formfield', 'text-with-label.pug.html'))
          assertExists(path.join(testProjectTargetPath, '_variants', 'formfield', 'text-without-label.pug.html'))
          assertExists(path.join(testProjectTargetPath, '_variants', 'input', 'number.pug.html'))
          assertExists(path.join(testProjectTargetPath, '_variants', 'input', 'text-disabled.pug.html'))
          assertExists(path.join(testProjectTargetPath, '_variants', 'input', 'text-required.pug.html'))
          assertExists(path.join(testProjectTargetPath, '_variants', 'input', 'text.hbs.html'))
          assertExists(path.join(testProjectTargetPath, '_variants', 'input', 'text.pug.html'))
          assertExists(path.join(testProjectTargetPath, '_variants', 'label', 'label-handlebars.hbs.html'))
          assertExists(path.join(testProjectTargetPath, '_variants', 'label', 'label-marko.marko.html'))
          assertExists(path.join(testProjectTargetPath, '_variants', 'label', 'label-pug.pug.html'))

          done()
        })
        .catch(done)
    })

    it('should copy theme assets', done => {
      const assetsPath = path.join(testProjectTargetPath, '_uiengine-theme')

      Core.generate(opts)
        .then(state => {
          assertExists(path.join(assetsPath, 'styles'))
          assertExists(path.join(assetsPath, 'scripts'))

          done()
        })
        .catch(done)
    })

    it('should throw error if no config option is provided', done => {
      Core.generate()
        .catch(error => {
          assert(error)
          done()
        })
    })
  })

  describe('#generateIncrementForFileChange', () => {
    it('should generate page on change', done => {
      const filePath = path.join(pagesPath, 'patterns', 'page.md')

      fs.removeSync(indexPath)

      Core.generateIncrementForFileChange(filePath, 'changed')
        .then(({ state, change }) => {
          assertContentMatches(indexPath, 'patterns')

          assert.equal(change.action, 'changed')
          assert.equal(change.type, 'page')
          assert.equal(change.item, 'patterns')
          assert.equal(change.file, path.join(testProjectRelativePath, 'src/uiengine/pages/patterns/page.md'))

          done()
        })
        .catch(done)
    })

    it('should generate state file on change', done => {
      const filePath = path.join(pagesPath, 'page.md')

      fs.removeSync(indexPath)

      Core.generateIncrementForFileChange(filePath, 'changed')
        .then(({ state, change }) => {
          assertExists(indexPath)

          assert.equal(change.action, 'changed')
          assert.equal(change.type, 'page')
          assert.equal(change.item, 'index')
          assert.equal(change.file, path.join(testProjectRelativePath, 'src', 'uiengine', 'pages', 'page.md'))

          done()
        })
        .catch(done)
    })

    it('should copy page files on change', done => {
      const filePath = path.join(pagesPath, 'testcases', 'extra-files', 'file-in-folder.txt')

      Core.generateIncrementForFileChange(filePath, 'changed')
        .then(({ state, change }) => {
          assertExists(path.join(testProjectTargetPath, 'testcases', 'extra-files', 'file-in-folder.txt'))

          assert.equal(change.action, 'changed')
          assert.equal(change.type, 'page')
          assert.equal(change.item, 'testcases')
          assert.equal(change.file, path.join(testProjectRelativePath, 'src', 'uiengine', 'pages', 'testcases', 'extra-files', 'file-in-folder.txt'))

          done()
        })
        .catch(done)
    })

    it('should generate page on create', done => {
      const filePath = path.join(pagesPath, 'testcases', 'created', 'page.md')
      const fileDir = path.dirname(filePath)

      fs.mkdirsSync(fileDir)
      fs.writeFileSync(filePath, '---\ntitle: Created\ncomponents:\n- label\n---\nContent for created page.')

      Core.generateIncrementForFileChange(filePath, 'created')
        .then(({ state, change }) => {
          assertContentMatches(indexPath, 'Content for created page.')

          assert.equal(change.action, 'created')
          assert.equal(change.type, 'page')
          assert.equal(change.item, 'testcases/created')
          assert.equal(change.file, path.join(testProjectRelativePath, 'src/uiengine/pages/testcases/created/page.md'))

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

      Core.generateIncrementForFileChange(filePath, 'created')
        .then(result => {
          assertContentMatches(indexPath, 'Created Page')

          fs.removeSync(filePath)

          Core.generateIncrementForFileChange(filePath, 'deleted')
            .then(({ state, change }) => {
              assertContentDoesNotMatch(indexPath, 'Created Page')

              assert.equal(change.action, 'deleted')
              assert.equal(change.type, 'page')
              assert.equal(change.item, 'testcases/created')
              assert.equal(change.file, path.join(testProjectRelativePath, 'src', 'uiengine', 'pages', 'testcases', 'created', 'page.md'))

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

      fs.removeSync(indexPath)

      Core.generateIncrementForFileChange(filePath, 'changed')
        .then(({ state, change }) => {
          assertContentMatches(indexPath, 'Entity')

          assert.equal(change.action, 'changed')
          assert.equal(change.type, 'schema')
          assert.equal(change.item, 'Entity')
          assert.equal(change.file, path.join(testProjectRelativePath, 'src', 'uiengine', 'schema', 'Entity.yml'))

          done()
        })
        .catch(done)
    })

    it('should generate component on change', done => {
      const filePath = path.join(componentsPath, 'form', 'form.pug')

      Core.generateIncrementForFileChange(filePath, 'changed')
        .then(({ state, change }) => {
          assertExists(path.join(testProjectTargetPath, '_variants', 'form', 'form.pug.html'))

          assert.equal(change.action, 'changed')
          assert.equal(change.type, 'component')
          assert.equal(change.item, 'form')
          assert.equal(change.file, path.join(testProjectRelativePath, 'src', 'components', 'form', 'form.pug'))

          done()
        })
        .catch(done)
    })

    it('should generate component on variant meta file change', done => {
      const filePath = path.join(componentsPath, 'input', 'variants', 'text.md')

      Core.generateIncrementForFileChange(filePath, 'changed')
        .then(({ state, change }) => {
          assertExists(path.join(testProjectTargetPath, '_variants', 'input', 'text.pug.html'))

          assert.equal(change.action, 'changed')
          assert.equal(change.type, 'component')
          assert.equal(change.item, 'input')
          assert.equal(change.file, path.join(testProjectRelativePath, 'src', 'components', 'input', 'variants', 'text.md'))

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

      Core.generateIncrementForFileChange(filePath, 'created')
        .then(({ state, change }) => {
          assert.equal(state.components['my-new-component'].title, 'New component')

          assert.equal(change.action, 'created')
          assert.equal(change.type, 'component')
          assert.equal(change.item, 'my-new-component')
          assert.equal(change.file, path.join(testProjectRelativePath, 'src', 'components', 'my-new-component', 'component.md'))

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

      Core.generateIncrementForFileChange(filePath, 'created')
        .then(({ state, change }) => {
          assert.equal(state.components['my-new-component'].title, 'New component')

          fs.removeSync(filePath)

          Core.generateIncrementForFileChange(filePath, 'deleted')
            .then(({ state, change }) => {
              assert.equal(state.components['my-new-component'].title, 'My New Component')

              assert.equal(change.action, 'deleted')
              assert.equal(change.type, 'component')
              assert.equal(change.item, 'my-new-component')
              assert.equal(change.file, path.join(testProjectRelativePath, 'src', 'components', 'my-new-component', 'component.md'))

              fs.removeSync(componentPath)

              Core.generateIncrementForFileChange(componentPath, 'deleted')
                .then(({ state, change }) => {
                  assert.equal(state.components['my-new-component'], null)

                  assert.equal(change.action, 'deleted')
                  assert.equal(change.type, 'component')
                  assert.equal(change.item, 'my-new-component')
                  assert.equal(change.file, path.join(testProjectRelativePath, 'src', 'components', 'my-new-component'))

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
      fs.removeSync(indexPath)

      Core.generateIncrementForFileChange(filePath, 'changed')
        .then(({ state, change }) => {
          assertExists(existingVariantPath)

          assert.equal(change.action, 'changed')
          assert.equal(change.type, 'variant')
          assert.equal(change.item, 'form/form.pug')
          assert.equal(change.file, path.join(testProjectRelativePath, 'src', 'components', 'form', 'variants', 'form.pug'))

          assertExists(indexPath)
          done()
        })
        .catch(done)
    })

    it('should generate variant on create', done => {
      const filePath = path.join(componentsPath, 'form', 'variants', 'form-fieldsets.pug')

      fs.removeSync(indexPath)
      fs.writeFileSync(filePath, 'p Test')

      Core.generateIncrementForFileChange(filePath, 'created')
        .then(({ state, change }) => {
          assertContentMatches(indexPath, 'Form Fieldsets')

          assert.equal(change.action, 'created')
          assert.equal(change.type, 'variant')
          assert.equal(change.item, 'form/form-fieldsets.pug')
          assert.equal(change.file, path.join(testProjectRelativePath, 'src', 'components', 'form', 'variants', 'form-fieldsets.pug'))

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

      fs.removeSync(indexPath)
      fs.writeFileSync(filePath, 'p Test')

      Core.generateIncrementForFileChange(filePath, 'created')
        .then(({ state, change }) => {
          assertContentMatches(indexPath, 'Form Fieldsets')

          fs.removeSync(filePath)

          Core.generateIncrementForFileChange(filePath, 'deleted')
            .then(({ state, change }) => {
              assertContentDoesNotMatch(indexPath, 'Form Fieldsets')

              assert.equal(change.action, 'deleted')
              assert.equal(change.type, 'variant')
              assert.equal(change.item, 'form/form-fieldsets.pug')
              assert.equal(change.file, path.join(testProjectRelativePath, 'src', 'components', 'form', 'variants', 'form-fieldsets.pug'))

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

      Core.generateIncrementForFileChange(filePath, 'changed')
        .then(({ state, change }) => {
          assertExists(templatePath)

          assert.equal(change.action, 'changed')
          assert.equal(change.type, 'page')
          assert.equal(change.item, 'testcases/custom-template')
          assert.equal(change.file, path.join(testProjectRelativePath, 'src', 'uiengine', 'pages', 'testcases', 'custom-template', 'page.md'))

          done()
        })
        .catch(done)
    })

    it('should regenerate pages with template on template change', done => {
      const filePath = path.join(templatesPath, 'page.pug')
      const templatePath = path.join(testProjectTargetPath, '_pages', 'testcases', 'custom-template.html')

      fs.removeSync(templatePath)

      Core.generateIncrementForFileChange(filePath, 'changed')
        .then(({ state, change }) => {
          assertExists(templatePath)

          assert.equal(change.action, 'changed')
          assert.equal(change.type, 'template')
          assert.equal(change.item, 'page')
          assert.equal(change.file, path.join(testProjectRelativePath, 'src', 'templates', 'page.pug'))

          done()
        })
        .catch(done)
    })

    it('should regenerate content on data change', done => {
      const filePath = path.join(dataPath, 'items.yml')

      Core.generateIncrementForFileChange(filePath, 'changed')
        .then(({ state, change }) => {
          assertExists(path.join(testProjectTargetPath, 'index.html'))

          assert.equal(change.action, 'changed')
          assert.equal(change.type, 'site')
          assert.equal(change.item, 'UIengine Sample Project')
          assert.equal(change.file, path.join(testProjectRelativePath, 'src/uiengine/data/items.yml'))

          done()
        })
        .catch(done)
    })

    it('should regenerate everything on theme file change', done => {
      const filePath = path.resolve(testProjectPath, 'node_modules', 'uiengine-theme-default', 'lib', 'index.js')

      Core.generateIncrementForFileChange(filePath, 'changed')
        .then(({ state, change }) => {
          assertExists(path.join(testProjectTargetPath, 'index.html'))

          assert.equal(change.action, 'changed')
          assert.equal(change.type, 'site')
          assert.equal(change.item, 'UIengine Sample Project')
          assert.equal(change.file, path.join(testProjectRelativePath, 'node_modules/uiengine-theme-default/lib/index.js'))

          done()
        })
        .catch(done)
    })
  })

  describe('#isGenerating', () => {
    it('should return whether or not a generate is currently running', done => {
      assert(!Core.isGenerating())

      Core.generate(opts)
        .then(state => {
          assert(!Core.isGenerating())

          done()
        })
        .catch(done)

      assert(Core.isGenerating())
    })
  })
})
