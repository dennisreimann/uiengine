const fs = require('fs-extra')
const assert = require('assert')
const { assertContentMatches, assertContentDoesNotMatch, assertExists } = require('../../../test/support/asserts')
const { dirname, join, resolve } = require('path')

const Core = require('../src/core')

const { testProjectPath, testProjectRelativePath, testProjectTargetPath } = require('../../../test/support/paths')
const dataPath = resolve(testProjectPath, 'uiengine', 'data')
const pagesPath = resolve(testProjectPath, 'uiengine', 'pages')
const elementsPath = resolve(testProjectPath, 'src', 'elements')
const modulesPath = resolve(testProjectPath, 'src', 'modules')
const templatesPath = resolve(testProjectPath, 'src', 'templates')
const indexPath = join(testProjectTargetPath, 'index.html')
const opts = { config: resolve(testProjectPath, 'uiengine.config.js') }

const assertDirectoryContainsThemeFiles = (prefixPath, postfixPath) => {
  assertExists(join(prefixPath, 'funky', `${postfixPath}.html`))
  assertExists(join(prefixPath, 'plain', `${postfixPath}.html`))
}

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
      await Core.generate(opts);

      [ ['form', 'form.pug-1'],
        ['formfield', 'text-with-label.pug-1'],
        ['formfield', 'text-without-label.pug-2'],
        ['input', 'text.hbs-1'],
        ['input', 'text.pug-2'],
        ['input', 'text-required.pug-3'],
        ['input', 'text-disabled.pug-4'],
        ['input', 'number.pug-5'],
        ['input', 'text-required.pug-3'],
        ['input', 'text-disabled.pug-4'],
        ['label', 'label.ejs-1'],
        ['label', 'label.hbs-2'],
        ['label', 'label.marko-4'],
        ['label', 'label.pug-5'],
        ['label', 'label.jsx-6'],
        ['label', 'label.jsx-7'],
        ['label', 'label-vue.js-8'],
        ['label', 'label-vue-sfc.vhtml-9']
      ].forEach(([componentId, variantId]) => {
        assertDirectoryContainsThemeFiles(join(testProjectTargetPath, '_variants'), join(componentId, variantId))
      })
    })

    it('should generate token previews', async () => {
      await Core.generate(opts);

      ['colors', 'icons', 'spaces', 'typography'].forEach(tokens => {
        assertDirectoryContainsThemeFiles(join(testProjectTargetPath, '_tokens'), join('documentation', 'tokens', tokens))
      })
    })

    it('should copy UI assets', async () => {
      const assetsPath = join(testProjectTargetPath, '_assets')
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
      const filePath = join(pagesPath, 'patterns', 'page.config.js')
      fs.removeSync(indexPath)
      const { change } = await Core.generateIncrementForFileChange(filePath, 'changed')

      assertContentMatches(indexPath, 'patterns')
      assert.strictEqual(change.action, 'changed')
      assert.strictEqual(change.type, 'page')
      assert.strictEqual(change.item, 'patterns')
      assert.strictEqual(change.file, join(testProjectRelativePath, 'uiengine', 'pages', 'patterns', 'page.config.js'))
    })

    it('should generate state file on change', async () => {
      const filePath = join(pagesPath, 'page.config.js')
      fs.removeSync(indexPath)
      const { change } = await Core.generateIncrementForFileChange(filePath, 'changed')

      assertExists(indexPath)
      assert.strictEqual(change.action, 'changed')
      assert.strictEqual(change.type, 'page')
      assert.strictEqual(change.item, 'index')
      assert.strictEqual(change.file, join(testProjectRelativePath, 'uiengine', 'pages', 'page.config.js'))
    })

    it('should copy page files on change', async () => {
      const filePath = join(pagesPath, 'testcases', 'extra-files', 'file-in-folder.txt')
      const { change } = await Core.generateIncrementForFileChange(filePath, 'changed')

      assertExists(join(testProjectTargetPath, 'testcases', 'extra-files', 'file-in-folder.txt'))
      assert.strictEqual(change.action, 'changed')
      assert.strictEqual(change.type, 'page')
      assert.strictEqual(change.item, 'testcases')
      assert.strictEqual(change.file, join(testProjectRelativePath, 'uiengine', 'pages', 'testcases', 'extra-files', 'file-in-folder.txt'))
    })

    it('should generate page on create', async () => {
      const filePath = join(pagesPath, 'testcases', 'created', 'README.md')
      const fileDir = dirname(filePath)

      fs.mkdirsSync(fileDir)
      fs.writeFileSync(filePath, '# Created\n\nContent for created page.')

      const { change } = await Core.generateIncrementForFileChange(filePath, 'created')
      fs.removeSync(fileDir)

      assertContentMatches(indexPath, 'Content for created page.')
      assert.strictEqual(change.action, 'created')
      assert.strictEqual(change.type, 'page')
      assert.strictEqual(change.item, 'testcases/created')
      assert.strictEqual(change.file, join(testProjectRelativePath, 'uiengine/pages/testcases/created/README.md'))
    })

    it('should generate page on delete', async () => {
      const filePath = join(pagesPath, 'testcases', 'created', 'README.md')
      const fileDir = dirname(filePath)

      fs.mkdirsSync(fileDir)
      fs.writeFileSync(filePath, '# Created Page\n\nContent for created page.')

      await Core.generateIncrementForFileChange(filePath, 'created')

      assertContentMatches(indexPath, 'Created Page')

      fs.removeSync(filePath)

      const { change } = await Core.generateIncrementForFileChange(filePath, 'deleted')
      fs.removeSync(fileDir)

      assertContentDoesNotMatch(indexPath, 'Created Page')

      assert.strictEqual(change.action, 'deleted')
      assert.strictEqual(change.type, 'page')
      assert.strictEqual(change.item, 'testcases/created')
      assert.strictEqual(change.file, join(testProjectRelativePath, 'uiengine', 'pages', 'testcases', 'created', 'README.md'))
    })

    it('should generate component on change', async () => {
      const filePath = join(elementsPath, 'label', 'label.pug')
      const { change } = await Core.generateIncrementForFileChange(filePath, 'changed')

      assertDirectoryContainsThemeFiles(join(testProjectTargetPath, '_variants'), join('label', 'label.pug-5'))
      assert.strictEqual(change.action, 'changed')
      assert.strictEqual(change.type, 'component')
      assert.strictEqual(change.item, 'label')
      assert.strictEqual(change.file, join(testProjectRelativePath, 'src', 'elements', 'label', 'label.pug'))
    })

    it('should generate component on create', async () => {
      const componentPath = join(modulesPath, 'my-new-component')
      const filePath = join(componentPath, 'README.md')
      const fileDir = dirname(filePath)
      fs.mkdirsSync(fileDir)
      fs.writeFileSync(filePath, '# New component\n')
      const { change, state } = await Core.generateIncrementForFileChange(filePath, 'created')
      fs.removeSync(fileDir)

      assert.strictEqual(state.components['my-new-component'].title, 'New component')
      assert.strictEqual(change.action, 'created')
      assert.strictEqual(change.type, 'component')
      assert.strictEqual(change.item, 'my-new-component')
      assert.strictEqual(change.file, join(testProjectRelativePath, 'src', 'modules', 'my-new-component', 'README.md'))
    })

    it('should generate component on delete', async () => {
      const componentPath = join(modulesPath, 'my-new-component')
      const filePath = join(componentPath, 'README.md')
      fs.mkdirsSync(componentPath)
      fs.writeFileSync(filePath, '# New component\n')
      const result1 = await Core.generateIncrementForFileChange(filePath, 'created')
      fs.removeSync(filePath)

      assert.strictEqual(result1.state.components['my-new-component'].title, 'New component')

      const result2 = await Core.generateIncrementForFileChange(filePath, 'deleted')
      fs.removeSync(componentPath)

      assert.strictEqual(result2.state.components['my-new-component'].title, 'My New Component')
      assert.strictEqual(result2.change.action, 'deleted')
      assert.strictEqual(result2.change.type, 'component')
      assert.strictEqual(result2.change.item, 'my-new-component')
      assert.strictEqual(result2.change.file, join(testProjectRelativePath, 'src', 'modules', 'my-new-component', 'README.md'))

      const result3 = await Core.generateIncrementForFileChange(componentPath, 'deleted')
      fs.removeSync(componentPath)

      assert.strictEqual(result3.state.components['my-new-component'], undefined)
      assert.strictEqual(result3.change.action, 'deleted')
      assert.strictEqual(result3.change.type, 'component')
      assert.strictEqual(result3.change.item, 'my-new-component')
      assert.strictEqual(result3.change.file, join(testProjectRelativePath, 'src', 'modules', 'my-new-component'))
    })

    it('should generate variant on change', async () => {
      const filePath = join(modulesPath, 'form', 'variants', 'form.pug')
      fs.removeSync(join(testProjectTargetPath, '_variants'))
      fs.removeSync(indexPath)
      const { change } = await Core.generateIncrementForFileChange(filePath, 'changed')

      assertDirectoryContainsThemeFiles(join(testProjectTargetPath, '_variants'), join('form', 'form.pug-1'))
      assert.strictEqual(change.action, 'changed')
      assert.strictEqual(change.type, 'variant')
      assert.strictEqual(change.item, 'form/form.pug')
      assert.strictEqual(change.file, join(testProjectRelativePath, 'src', 'modules', 'form', 'variants', 'form.pug'))
      assertExists(indexPath)
    })

    it('should generate variant on create', async () => {
      const filePath = join(modulesPath, 'form', 'variants', 'form-fieldsets.pug')
      fs.removeSync(indexPath)
      fs.writeFileSync(filePath, 'p Test')
      const { change } = await Core.generateIncrementForFileChange(filePath, 'created')
      fs.removeSync(filePath)

      assertContentMatches(indexPath, 'Form Fieldsets')
      assert.strictEqual(change.action, 'created')
      assert.strictEqual(change.type, 'variant')
      assert.strictEqual(change.item, 'form/form-fieldsets.pug')
      assert.strictEqual(change.file, join(testProjectRelativePath, 'src', 'modules', 'form', 'variants', 'form-fieldsets.pug'))
    })

    it('should generate variant on delete', async () => {
      const filePath = join(modulesPath, 'form', 'variants', 'form-fieldsets.pug')
      fs.removeSync(indexPath)
      fs.writeFileSync(filePath, 'p Test')
      await Core.generateIncrementForFileChange(filePath, 'created')
      fs.removeSync(filePath)

      assertContentMatches(indexPath, 'Form Fieldsets')

      const { change } = await Core.generateIncrementForFileChange(filePath, 'deleted')
      fs.removeSync(filePath)

      assertContentDoesNotMatch(indexPath, 'Form Fieldsets')
      assert.strictEqual(change.action, 'deleted')
      assert.strictEqual(change.type, 'variant')
      assert.strictEqual(change.item, 'form/form-fieldsets.pug')
      assert.strictEqual(change.file, join(testProjectRelativePath, 'src', 'modules', 'form', 'variants', 'form-fieldsets.pug'))
    })

    it('should regenerate pages with tokens on change', async () => {
      const filePath = join(pagesPath, 'documentation', 'tokens', 'colors', 'page.config.js')
      fs.removeSync(join(testProjectTargetPath, '_tokens'))
      const { change } = await Core.generateIncrementForFileChange(filePath, 'changed')

      assertDirectoryContainsThemeFiles(join(testProjectTargetPath, '_tokens'), join('documentation', 'tokens', 'colors'))
      assert.strictEqual(change.action, 'changed')
      assert.strictEqual(change.type, 'page')
      assert.strictEqual(change.item, 'documentation/tokens/colors')
      assert.strictEqual(change.file, join(testProjectRelativePath, 'uiengine', 'pages', 'documentation', 'tokens', 'colors', 'page.config.js'))
    })

    it('should regenerate pages with template on change', async () => {
      const filePath = join(pagesPath, 'testcases', 'custom-template', 'page.config.js')
      fs.removeSync(join(testProjectTargetPath, '_pages'))
      const { change } = await Core.generateIncrementForFileChange(filePath, 'changed')

      assertDirectoryContainsThemeFiles(join(testProjectTargetPath, '_pages'), join('testcases', 'custom-template'))
      assert.strictEqual(change.action, 'changed')
      assert.strictEqual(change.type, 'page')
      assert.strictEqual(change.item, 'testcases/custom-template')
      assert.strictEqual(change.file, join(testProjectRelativePath, 'uiengine', 'pages', 'testcases', 'custom-template', 'page.config.js'))
    })

    it('should regenerate pages with template on template change', async () => {
      const filePath = join(templatesPath, 'page.pug')
      fs.removeSync(join(testProjectTargetPath, '_pages'))

      const { change } = await Core.generateIncrementForFileChange(filePath, 'changed')

      assertDirectoryContainsThemeFiles(join(testProjectTargetPath, '_pages'), join('testcases', 'custom-template'))
      assert.strictEqual(change.action, 'changed')
      assert.strictEqual(change.type, 'template')
      assert.strictEqual(change.item, 'page.pug')
      assert.strictEqual(change.file, join(testProjectRelativePath, 'src', 'templates', 'page.pug'))
    })

    it('should regenerate content on data change', async () => {
      const filePath = join(dataPath, 'items.yml')
      const { change } = await Core.generateIncrementForFileChange(filePath, 'changed')

      assertExists(join(testProjectTargetPath, 'index.html'))
      assert.strictEqual(change.action, 'changed')
      assert.strictEqual(change.type, 'site')
      assert.strictEqual(change.item, 'UIengine Sample Project')
      assert.strictEqual(change.file, join(testProjectRelativePath, 'uiengine/data/items.yml'))
    })

    it('should regenerate everything on UI file change', async () => {
      const filePath = resolve(testProjectPath, 'node_modules', '@uiengine', 'ui', 'lib', 'index.js')
      const { change } = await Core.generateIncrementForFileChange(filePath, 'changed')

      assertExists(join(testProjectTargetPath, 'index.html'))
      assert.strictEqual(change.action, 'changed')
      assert.strictEqual(change.type, 'site')
      assert.strictEqual(change.item, 'UIengine Sample Project')
      assert.strictEqual(change.file, join(testProjectRelativePath, 'node_modules/@uiengine/ui/lib/index.js'))
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
