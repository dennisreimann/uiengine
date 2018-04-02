require('mocha-sinon')()

const fs = require('fs-extra')
const assert = require('assert')
const assertExists = require('../../../test/support/assertExists')
const assertContentMatches = require('../../../test/support/assertContentMatches')
const assertContentDoesNotMatch = require('../../../test/support/assertContentDoesNotMatch')
const { dirname, join, resolve } = require('path')

const Core = require('../src/core')

const { testProjectPath, testProjectRelativePath, testProjectTargetPath } = require('../../../test/support/paths')
const dataPath = resolve(testProjectPath, 'src', 'uiengine', 'data')
const pagesPath = resolve(testProjectPath, 'src', 'uiengine', 'pages')
const entitiesPath = resolve(testProjectPath, 'src', 'uiengine', 'entities')
const componentsPath = resolve(testProjectPath, 'src', 'components')
const templatesPath = resolve(testProjectPath, 'src', 'templates')
const indexPath = join(testProjectTargetPath, 'index.html')
const opts = { config: resolve(testProjectPath, 'uiengine.config.js') }

// "end to end" tests
describe('Core', function () {
  this.timeout(5000)

  afterEach(() => { fs.removeSync(testProjectTargetPath) })

  describe('#generate', () => {
    it('should generate index page', async () => {
      await Core.generate(opts)

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
    })

    describe('with debug level set', () => {
      it('should generate state file', async () => {
        const optsWithDebug = Object.assign({}, opts, { debug: true })
        await Core.generate(optsWithDebug)

        assertExists(join(testProjectTargetPath, '_state.json'))
      })
    })

    it('should generate variant previews', async () => {
      await Core.generate(opts)

      assertExists(join(testProjectTargetPath, '_variants', 'form', 'form.pug.html'))
      assertExists(join(testProjectTargetPath, '_variants', 'formfield', 'text-with-label.pug.html'))
      assertExists(join(testProjectTargetPath, '_variants', 'formfield', 'text-without-label.pug.html'))
      assertExists(join(testProjectTargetPath, '_variants', 'input', 'number.pug.html'))
      assertExists(join(testProjectTargetPath, '_variants', 'input', 'text-disabled.pug.html'))
      assertExists(join(testProjectTargetPath, '_variants', 'input', 'text-required.pug.html'))
      assertExists(join(testProjectTargetPath, '_variants', 'input', 'text.hbs.html'))
      assertExists(join(testProjectTargetPath, '_variants', 'input', 'text.pug.html'))
      assertExists(join(testProjectTargetPath, '_variants', 'label', 'label.hbs.html'))
      assertExists(join(testProjectTargetPath, '_variants', 'label', 'label.marko.html'))
      assertExists(join(testProjectTargetPath, '_variants', 'label', 'label.pug.html'))
    })

    it('should copy theme assets', async () => {
      const assetsPath = join(testProjectTargetPath, '_uiengine-theme')
      await Core.generate(opts)

      assertExists(join(assetsPath, 'styles'))
      assertExists(join(assetsPath, 'scripts'))
    })

    it('should throw error if no config option is provided', async () => {
      try {
        await Core.generate()
      } catch (error) {
        assert(error)
      }
    })
  })

  describe('#generateIncrementForFileChange', () => {
    it('should generate page on change', async () => {
      const filePath = join(pagesPath, 'patterns', 'page.md')
      fs.removeSync(indexPath)
      const { change } = await Core.generateIncrementForFileChange(filePath, 'changed')

      assertContentMatches(indexPath, 'patterns')
      assert.equal(change.action, 'changed')
      assert.equal(change.type, 'page')
      assert.equal(change.item, 'patterns')
      assert.equal(change.file, join(testProjectRelativePath, 'src/uiengine/pages/patterns/page.md'))
    })

    it('should generate state file on change', async () => {
      const filePath = join(pagesPath, 'page.md')
      fs.removeSync(indexPath)
      const { change } = await Core.generateIncrementForFileChange(filePath, 'changed')

      assertExists(indexPath)
      assert.equal(change.action, 'changed')
      assert.equal(change.type, 'page')
      assert.equal(change.item, 'index')
      assert.equal(change.file, join(testProjectRelativePath, 'src', 'uiengine', 'pages', 'page.md'))
    })

    it('should copy page files on change', async () => {
      const filePath = join(pagesPath, 'testcases', 'extra-files', 'file-in-folder.txt')
      const { change } = await Core.generateIncrementForFileChange(filePath, 'changed')

      assertExists(join(testProjectTargetPath, 'testcases', 'extra-files', 'file-in-folder.txt'))
      assert.equal(change.action, 'changed')
      assert.equal(change.type, 'page')
      assert.equal(change.item, 'testcases')
      assert.equal(change.file, join(testProjectRelativePath, 'src', 'uiengine', 'pages', 'testcases', 'extra-files', 'file-in-folder.txt'))
    })

    it('should generate page on create', async () => {
      const filePath = join(pagesPath, 'testcases', 'created', 'page.md')
      const fileDir = dirname(filePath)

      fs.mkdirsSync(fileDir)
      fs.writeFileSync(filePath, '---\ntitle: Created\ncomponents:\n- label\n---\nContent for created page.')

      const { change } = await Core.generateIncrementForFileChange(filePath, 'created')

      assertContentMatches(indexPath, 'Content for created page.')
      assert.equal(change.action, 'created')
      assert.equal(change.type, 'page')
      assert.equal(change.item, 'testcases/created')
      assert.equal(change.file, join(testProjectRelativePath, 'src/uiengine/pages/testcases/created/page.md'))

      fs.removeSync(fileDir)
    })

    it('should generate page on delete', async () => {
      const filePath = join(pagesPath, 'testcases', 'created', 'page.md')
      const fileDir = dirname(filePath)

      fs.mkdirsSync(fileDir)
      fs.writeFileSync(filePath, '---\ntitle: Created Page\n---\nContent for created page.')

      await Core.generateIncrementForFileChange(filePath, 'created')

      assertContentMatches(indexPath, 'Created Page')

      fs.removeSync(filePath)

      const { change } = await Core.generateIncrementForFileChange(filePath, 'deleted')

      assertContentDoesNotMatch(indexPath, 'Created Page')

      assert.equal(change.action, 'deleted')
      assert.equal(change.type, 'page')
      assert.equal(change.item, 'testcases/created')
      assert.equal(change.file, join(testProjectRelativePath, 'src', 'uiengine', 'pages', 'testcases', 'created', 'page.md'))

      fs.removeSync(fileDir)
    })

    it('should generate entity update on change', async () => {
      const filePath = join(entitiesPath, 'Entity.yml')
      fs.removeSync(indexPath)
      const { change } = await Core.generateIncrementForFileChange(filePath, 'changed')

      assertContentMatches(indexPath, 'Entity')
      assert.equal(change.action, 'changed')
      assert.equal(change.type, 'entity')
      assert.equal(change.item, 'Entity')
      assert.equal(change.file, join(testProjectRelativePath, 'src', 'uiengine', 'entities', 'Entity.yml'))
    })

    it('should generate component on change', async () => {
      const filePath = join(componentsPath, 'form', 'form.pug')
      const { change } = await Core.generateIncrementForFileChange(filePath, 'changed')

      assertExists(join(testProjectTargetPath, '_variants', 'form', 'form.pug.html'))
      assert.equal(change.action, 'changed')
      assert.equal(change.type, 'component')
      assert.equal(change.item, 'form')
      assert.equal(change.file, join(testProjectRelativePath, 'src', 'components', 'form', 'form.pug'))
    })

    it('should generate component on create', async () => {
      const componentPath = join(componentsPath, 'my-new-component')
      const filePath = join(componentPath, 'component.md')
      const fileDir = dirname(filePath)
      fs.mkdirsSync(fileDir)
      fs.writeFileSync(filePath, '---\ntitle: New component\n---\n')
      const { change, state } = await Core.generateIncrementForFileChange(filePath, 'created')

      assert.equal(state.components['my-new-component'].title, 'New component')
      assert.equal(change.action, 'created')
      assert.equal(change.type, 'component')
      assert.equal(change.item, 'my-new-component')
      assert.equal(change.file, join(testProjectRelativePath, 'src', 'components', 'my-new-component', 'component.md'))

      fs.removeSync(fileDir)
    })

    it('should generate component on delete', async () => {
      const componentPath = join(componentsPath, 'my-new-component')
      const filePath = join(componentPath, 'component.md')
      fs.mkdirsSync(componentPath)
      fs.writeFileSync(filePath, '---\ntitle: New component\n---\n')
      const result1 = await Core.generateIncrementForFileChange(filePath, 'created')

      assert.equal(result1.state.components['my-new-component'].title, 'New component')

      fs.removeSync(filePath)
      const result2 = await Core.generateIncrementForFileChange(filePath, 'deleted')

      assert.equal(result2.state.components['my-new-component'].title, 'My New Component')
      assert.equal(result2.change.action, 'deleted')
      assert.equal(result2.change.type, 'component')
      assert.equal(result2.change.item, 'my-new-component')
      assert.equal(result2.change.file, join(testProjectRelativePath, 'src', 'components', 'my-new-component', 'component.md'))

      fs.removeSync(componentPath)
      const result3 = await Core.generateIncrementForFileChange(componentPath, 'deleted')

      assert.equal(result3.state.components['my-new-component'], null)
      assert.equal(result3.change.action, 'deleted')
      assert.equal(result3.change.type, 'component')
      assert.equal(result3.change.item, 'my-new-component')
      assert.equal(result3.change.file, join(testProjectRelativePath, 'src', 'components', 'my-new-component'))

      fs.removeSync(componentPath)
    })

    it('should generate variant on change', async () => {
      const filePath = join(componentsPath, 'form', 'variants', 'form.pug')
      const existingVariantPath = join(testProjectTargetPath, '_variants', 'form', 'form.pug.html')
      fs.removeSync(existingVariantPath)
      fs.removeSync(indexPath)
      const { change } = await Core.generateIncrementForFileChange(filePath, 'changed')

      assertExists(existingVariantPath)
      assert.equal(change.action, 'changed')
      assert.equal(change.type, 'variant')
      assert.equal(change.item, 'form/form.pug')
      assert.equal(change.file, join(testProjectRelativePath, 'src', 'components', 'form', 'variants', 'form.pug'))
      assertExists(indexPath)
    })

    it('should generate variant on create', async () => {
      const filePath = join(componentsPath, 'form', 'variants', 'form-fieldsets.pug')
      fs.removeSync(indexPath)
      fs.writeFileSync(filePath, 'p Test')
      const { change } = await Core.generateIncrementForFileChange(filePath, 'created')

      assertContentMatches(indexPath, 'Form Fieldsets')
      assert.equal(change.action, 'created')
      assert.equal(change.type, 'variant')
      assert.equal(change.item, 'form/form-fieldsets.pug')
      assert.equal(change.file, join(testProjectRelativePath, 'src', 'components', 'form', 'variants', 'form-fieldsets.pug'))

      fs.removeSync(filePath)
    })

    it('should generate variant on delete', async () => {
      const filePath = join(componentsPath, 'form', 'variants', 'form-fieldsets.pug')
      fs.removeSync(indexPath)
      fs.writeFileSync(filePath, 'p Test')
      await Core.generateIncrementForFileChange(filePath, 'created')

      assertContentMatches(indexPath, 'Form Fieldsets')

      fs.removeSync(filePath)
      const { change } = await Core.generateIncrementForFileChange(filePath, 'deleted')

      assertContentDoesNotMatch(indexPath, 'Form Fieldsets')
      assert.equal(change.action, 'deleted')
      assert.equal(change.type, 'variant')
      assert.equal(change.item, 'form/form-fieldsets.pug')
      assert.equal(change.file, join(testProjectRelativePath, 'src', 'components', 'form', 'variants', 'form-fieldsets.pug'))

      fs.removeSync(filePath)
    })

    it('should regenerate pages with template on change', async () => {
      const filePath = join(pagesPath, 'testcases', 'custom-template', 'page.md')
      const templatePath = join(testProjectTargetPath, '_pages', 'testcases', 'custom-template.html')
      fs.removeSync(templatePath)
      const { change } = await Core.generateIncrementForFileChange(filePath, 'changed')

      assertExists(templatePath)
      assert.equal(change.action, 'changed')
      assert.equal(change.type, 'page')
      assert.equal(change.item, 'testcases/custom-template')
      assert.equal(change.file, join(testProjectRelativePath, 'src', 'uiengine', 'pages', 'testcases', 'custom-template', 'page.md'))
    })

    it('should regenerate pages with template on template change', async () => {
      const filePath = join(templatesPath, 'page.pug')
      const templatePath = join(testProjectTargetPath, '_pages', 'testcases', 'custom-template.html')

      fs.removeSync(templatePath)

      const { change } = await Core.generateIncrementForFileChange(filePath, 'changed')

      assertExists(templatePath)
      assert.equal(change.action, 'changed')
      assert.equal(change.type, 'template')
      assert.equal(change.item, 'page.pug')
      assert.equal(change.file, join(testProjectRelativePath, 'src', 'templates', 'page.pug'))
    })

    it('should regenerate content on data change', async () => {
      const filePath = join(dataPath, 'items.yml')
      const { change } = await Core.generateIncrementForFileChange(filePath, 'changed')

      assertExists(join(testProjectTargetPath, 'index.html'))
      assert.equal(change.action, 'changed')
      assert.equal(change.type, 'site')
      assert.equal(change.item, 'UIengine Sample Project')
      assert.equal(change.file, join(testProjectRelativePath, 'src/uiengine/data/items.yml'))
    })

    it('should regenerate everything on theme file change', async () => {
      const filePath = resolve(testProjectPath, 'node_modules', '@uiengine', 'theme', 'lib', 'index.js')
      const { change } = await Core.generateIncrementForFileChange(filePath, 'changed')

      assertExists(join(testProjectTargetPath, 'index.html'))
      assert.equal(change.action, 'changed')
      assert.equal(change.type, 'site')
      assert.equal(change.item, 'UIengine Sample Project')
      assert.equal(change.file, join(testProjectRelativePath, 'node_modules/@uiengine/theme/lib/index.js'))
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
