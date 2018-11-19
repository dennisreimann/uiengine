const assert = require('assert')
const { join } = require('path')
const { ensureDirSync, outputFileSync, removeSync } = require('fs-extra')
const { runCommand } = require('./support/util')
const { assertContentMatches, assertDoesNotExist, assertExists, assertMatches } = require('../../../test/support/asserts')
const { testTmpPath } = require('../../../test/support/paths')
const testPath = join(testTmpPath, 'cli-project')

const readConfigFile = configPath => {
  delete require.cache[require.resolve(configPath)]
  return require(configPath)
}

// Beware: These tests assume that the whole suite runs in order.
// The tests build up on each other – keeping it pragmatic here.
describe('CLI', function () {
  this.timeout(5000)

  before(() => { ensureDirSync(testPath) })
  after(() => { removeSync(testTmpPath) })

  describe('init command', () => {
    it('should create a basic structure and config file', async () => {
      const stdout = await runCommand(testPath, 'uiengine init')

      // stdout
      assertMatches(stdout, 'Initialized Cli Project')
      assertMatches(stdout, 'The following files were created:\n\n- uiengine.config.js\n- src/templates/uiengine.html\n- uiengine/pages/page.config.js\n- uiengine/pages/README.md')

      // config
      const configPath = join(testPath, 'uiengine.config.js')
      assertExists(configPath)

      const config = readConfigFile(configPath)

      assert.strictEqual(config.name, 'Cli Project')
      assert.strictEqual(config.source.components, './src/components')
      assert.strictEqual(config.source.templates, './src/templates')
      assert.strictEqual(config.source.pages, './uiengine/pages')
      assert.strictEqual(config.source.entities, './uiengine/entities')
      assert.strictEqual(config.target, './dist')
      assert.strictEqual(config.adapters.html, '@uiengine/adapter-html')
      assert.strictEqual(config.template, 'uiengine.html')

      // homepage
      const homepagePath = join(testPath, 'uiengine/pages/README.md')
      assertContentMatches(homepagePath, 'It looks like you have just set up this project.')

      // preview
      const previewPath = join(testPath, 'src/templates/uiengine.html')
      assertContentMatches(previewPath, '<!-- uiengine:title -->')
      assertContentMatches(previewPath, '<!-- uiengine:class -->')
      assertContentMatches(previewPath, '<!-- uiengine:content -->')
      assertContentMatches(previewPath, 'add your custom styles here')
      assertContentMatches(previewPath, 'add your custom scripts here')
    })

    it('should not overwrite existing files', async () => {
      const stdout = await runCommand(testPath, 'uiengine init')

      // stdout
      assertMatches(stdout, 'The following files already existed:\n\n- uiengine.config.js\n- src/templates/uiengine.html\n- uiengine/pages/page.config.js\n- uiengine/pages/README.md')
    })

    describe('with force flag', () => {
      it('should overwrite existing files', async () => {
        const stdout = await runCommand(testPath, 'uiengine init -f')

        // stdout
        assertMatches(stdout, 'The following files were created:\n\n- uiengine.config.js\n- src/templates/uiengine.html\n- uiengine/pages/page.config.js\n- uiengine/pages/README.md')
      })
    })

    describe('with override flag', () => {
      it('should override config parameters', async () => {
        // remove files from previous run
        removeSync(testTmpPath)
        ensureDirSync(testPath)

        await runCommand(testPath, 'uiengine init --override.name=OVERRIDE --override.source.pages=uiengine/pages --override.target=./dist/override-target --override.ui.lang=de')

        const configPath = join(testPath, 'uiengine.config.js')
        const config = readConfigFile(configPath)

        assert.strictEqual(config.name, 'OVERRIDE')
        assert.strictEqual(config.source.pages, 'uiengine/pages')
        assert.strictEqual(config.target, './dist/override-target')
        assert.strictEqual(config.ui.lang, 'de')
      })
    })

    describe('with demo flag', () => {
      it('should create the demo files', async () => {
        // remove files from previous run
        removeSync(testTmpPath)
        ensureDirSync(testPath)

        const stdout = await runCommand(testPath, 'uiengine init --demo')

        // stdout
        assertMatches(stdout, 'In addition to these we also created some demo components and pages.')

        // page files
        assertExists(join(testPath, 'uiengine/pages/patterns/page.config.js'))
        assertExists(join(testPath, 'uiengine/pages/patterns/README.md'))
        assertExists(join(testPath, 'uiengine/pages/patterns/elements/page.config.js'))
        assertExists(join(testPath, 'uiengine/pages/patterns/components/page.config.js'))

        // component files
        assertExists(join(testPath, 'src/components/button'))
        assertExists(join(testPath, 'src/components/copytext'))
        assertExists(join(testPath, 'src/components/heading'))
        assertExists(join(testPath, 'src/components/teaser'))
      })
    })
  })

  describe('page command', () => {
    it('should create the page files', async () => {
      const stdout = await runCommand(testPath, 'uiengine page atoms molecules')
      const atomsConfigPath = 'uiengine/pages/atoms/page.config.js'
      const atomsReadmePath = 'uiengine/pages/atoms/README.md'
      const moleculesConfigPath = 'uiengine/pages/molecules/page.config.js'
      const moleculesReadmePath = 'uiengine/pages/molecules/README.md'

      // stdout
      assertMatches(stdout, 'Pages created')
      assertMatches(stdout, `The following files were created:\n\n- ${atomsConfigPath}\n- ${atomsReadmePath}\n- ${moleculesConfigPath}\n- ${moleculesReadmePath}`)

      // page files
      assertContentMatches(join(testPath, atomsReadmePath), '# Atoms')
      assertContentMatches(join(testPath, atomsConfigPath), 'module.exports = {}')
      assertContentMatches(join(testPath, moleculesReadmePath), '# Molecules')
      assertContentMatches(join(testPath, moleculesConfigPath), 'module.exports = {}')
    })

    it('should not overwrite existing files', async () => {
      const stdout = await runCommand(testPath, 'uiengine page atoms molecules organisms')
      const atomsPagePath = 'uiengine/pages/atoms/page.config.js'
      const atomsReadmePath = 'uiengine/pages/atoms/README.md'
      const moleculesPagePath = 'uiengine/pages/molecules/page.config.js'
      const moleculesReadmePath = 'uiengine/pages/molecules/README.md'
      const organismsPagePath = 'uiengine/pages/organisms/page.config.js'
      const organismsReadmePath = 'uiengine/pages/organisms/README.md'

      assertMatches(stdout, `The following files already existed:\n\n- ${atomsPagePath}\n- ${atomsReadmePath}\n- ${moleculesPagePath}\n- ${moleculesReadmePath}`)
      assertMatches(stdout, `The following files were created:\n\n- ${organismsPagePath}\n- ${organismsReadmePath}`)
    })

    describe('with force flag', () => {
      it('should overwrite existing files ', async () => {
        const stdout = await runCommand(testPath, 'uiengine page atoms molecules --force')
        const atomsPagePath = 'uiengine/pages/atoms/page.config.js'
        const atomsReadmePath = 'uiengine/pages/atoms/README.md'
        const moleculesPagePath = 'uiengine/pages/molecules/page.config.js'
        const moleculesReadmePath = 'uiengine/pages/molecules/README.md'

        assertMatches(stdout, `The following files were created:\n\n- ${atomsPagePath}\n- ${atomsReadmePath}\n- ${moleculesPagePath}\n- ${moleculesReadmePath}`)
      })
    })
  })

  describe('component command', () => {
    it('should create the basic files for a new component', async () => {
      const stdout = await runCommand(testPath, 'uiengine component list')
      const configPath = 'src/components/list/component.config.js'
      const readmePath = 'src/components/list/README.md'

      // stdout
      assertMatches(stdout, 'List created')
      assertMatches(stdout, `The following files were created:\n\n- ${configPath}\n- ${readmePath}`)

      // component file
      assertContentMatches(join(testPath, configPath), 'module.exports = {}')
      assertContentMatches(join(testPath, readmePath), '# List')
    })

    it('should not overwrite existing files', async () => {
      const stdout = await runCommand(testPath, 'uiengine component button default primary')

      assertMatches(stdout, `The following files already existed:\n\n- src/components/button/component.config.js\n- src/components/button/README.md`)
    })

    describe('with force flag', () => {
      it('should overwrite existing files ', async () => {
        const stdout = await runCommand(testPath, 'uiengine component button --force')

        assertMatches(stdout, `The following files were created:\n\n- src/components/button/component.config.js\n- src/components/button/README.md`)
      })
    })
  })

  describe('build command', () => {
    it('should build the site', async () => {
      const stdout = await runCommand(testPath, 'uiengine build')

      // stdout
      assertMatches(stdout, 'Build done')

      // index file
      const indexPath = join(testPath, 'dist/index.html')
      assertExists(indexPath)
      assertContentMatches(indexPath, 'window.UIengine = {')
      assertContentMatches(indexPath, 'state: {"config":{"name":"Cli Project"')
      assertContentMatches(indexPath, '/_assets/scripts/main')
      assertContentMatches(indexPath, '/_assets/styles/main')

      // ui
      assertExists(join(testPath, 'dist/_assets/scripts'))
      assertExists(join(testPath, 'dist/_assets/styles'))

      // sketch file
      assertExists(join(testPath, 'dist/_sketch.html'))
    })

    it('should build the demo', async () => {
      await runCommand(testPath, 'uiengine init --demo')

      const stdout = await runCommand(testPath, 'uiengine build')

      // stdout
      assertMatches(stdout, 'Build done')

      // variants
      assertExists(join(testPath, 'dist/_variants/heading/title.html-1.html'))
      assertExists(join(testPath, 'dist/_variants/heading/subtitle.html-2.html'))
    })

    describe('with debug flag', () => {
      it('should create the state file', async () => {
        await runCommand(testPath, 'uiengine build -d=1')

        // state file
        assertExists(join(testPath, 'dist/_state.json'))
      })
    })

    describe('with override flag', () => {
      it('should override config parameters', async () => {
        await runCommand(testPath, 'uiengine build --override.version=123.456.789 --override.target=./dist/override-target --override.ui.lang=de')

        const indexPath = join(testPath, 'dist/override-target/index.html')

        assertExists(indexPath)
        assertContentMatches(indexPath, '123.456.789')
        assertContentMatches(indexPath, 'html lang="de"')
      })
    })
  })

  describe('migrate command', () => {
    const migratePath = join(__dirname, 'fixtures/migrate')

    describe('with component.md migration', () => {
      const componentsPath = join(migratePath, 'components')
      const buttonPath = join(componentsPath, 'button')
      const componentMdPath = join(buttonPath, 'component.md')
      const readmePath = join(buttonPath, 'README.md')
      const configPath = join(buttonPath, 'component.config.js')

      afterEach(() => { removeSync(componentsPath) })

      it('should replace component.md file with component.config.js and README.md', async () => {
        outputFileSync(componentMdPath, `---\ntitle: Button\nvariants:\n- test.pug\n---\nThis is the button description.`)

        const out = await runCommand(migratePath, 'uiengine migrate component.md')
        assertMatches(out, 'The component.md files have been replaced with component.config.js and README.md files.')

        assertExists(configPath)
        const component = require(configPath)
        assert.strictEqual(Object.keys(component).length, 2)
        assert.strictEqual(component.title, 'Button')
        assert.strictEqual(component.variants.length, 1)
        assert.strictEqual(component.variants[0], 'test.pug')

        assertContentMatches(readmePath, 'This is the button description.\n')

        assertDoesNotExist(componentMdPath, `${componentMdPath} should have been deleted.`)
      })

      it('should report info if there are no component.md files to migrate', async () => {
        const out = await runCommand(migratePath, 'uiengine migrate component.md')
        assertMatches(out, 'No component.md files to migrate.')
      })

      describe('and component with just content', () => {
        it('should replace component.md file with README.md', async () => {
          outputFileSync(componentMdPath, `This is the button description.`)
          await runCommand(migratePath, 'uiengine migrate component.md')

          assertContentMatches(readmePath, 'This is the button description.\n')

          assertDoesNotExist(configPath, `${configPath} should not exist, because there should be no attributes.`)

          assertDoesNotExist(componentMdPath, `${componentMdPath} should have been deleted.`)
        })
      })
    })

    describe('with page.md migration', () => {
      const pagesPath = join(migratePath, 'pages')
      const pageMdPath = join(pagesPath, 'page.md')
      const readmePath = join(pagesPath, 'README.md')
      const configPath = join(pagesPath, 'page.config.js')

      afterEach(() => { removeSync(pagesPath) })

      it('should report success if there are page.md files', async () => {
        outputFileSync(pageMdPath, `---\ntitle: Homepage\n---\n# Homepage\n\nThis is the homepage content.`)

        const out = await runCommand(migratePath, 'uiengine migrate page.md')
        assertMatches(out, 'The page.md files have been replaced with page.config.js and README.md files.')
      })

      it('should report info if there are no page.md files to migrate', async () => {
        const out = await runCommand(migratePath, 'uiengine migrate page.md')
        assertMatches(out, 'No page.md files to migrate.')
      })

      describe('and pages with only title attribute', () => {
        it('should replace page.md file with README.md and convert title to first heading', async () => {
          outputFileSync(pageMdPath, `---\ntitle: Homepage\n---\nThis is the homepage content.`)

          await runCommand(migratePath, 'uiengine migrate page.md')

          assertContentMatches(readmePath, '# Homepage\n\nThis is the homepage content.\n')

          assertDoesNotExist(configPath, `${configPath} should not exist, because there should be no attributes.`)

          assertDoesNotExist(pageMdPath, `${pageMdPath} should have been deleted.`)
        })

        it('should replace page.md file with README.md and not convert title to first heading if it is already present', async () => {
          outputFileSync(pageMdPath, `---\ntitle: Homepage\n---\n# Homepage\n\nThis is the homepage content.`)

          await runCommand(migratePath, 'uiengine migrate page.md')

          assertContentMatches(readmePath, '# Homepage\n\nThis is the homepage content.\n')

          assertDoesNotExist(configPath, `${configPath} should not exist, because there should be no attributes.`)

          assertDoesNotExist(pageMdPath, `${pageMdPath} should have been deleted.`)
        })
      })

      describe('and pages with multiple attributes', () => {
        it('should replace page.md file with page.config.js and README.md', async () => {
          outputFileSync(pageMdPath, `---\ntitle: Homepage\ntemplate: page.pug\n---\nThis is the homepage content.`)
          await runCommand(migratePath, 'uiengine migrate page.md')

          assertExists(configPath)
          const page = require(configPath)
          assert.strictEqual(Object.keys(page).length, 1)
          assert.strictEqual(page.template, 'page.pug')

          assertContentMatches(readmePath, '# Homepage\n\nThis is the homepage content.\n')

          assertDoesNotExist(pageMdPath, `${pageMdPath} should have been deleted.`)
        })
      })

      describe('and pages with neither attributes nor content', () => {
        it('should delete page.md file', async () => {
          outputFileSync(pageMdPath, '')
          await runCommand(migratePath, 'uiengine migrate page.md')

          assertDoesNotExist(configPath, `${configPath} should not exist, because there should be no attributes.`)

          assertDoesNotExist(readmePath, `${readmePath} should not exist, because there should be no content.`)

          assertDoesNotExist(pageMdPath, `${pageMdPath} should have been deleted.`)
        })
      })

      describe('and pages with just attributes', () => {
        it('should replace page.md file with README.mdpage.config.js', async () => {
          outputFileSync(pageMdPath, '---\ntemplate: page.pug\n---')
          await runCommand(migratePath, 'uiengine migrate page.md')

          assertExists(configPath)
          const page = require(configPath)
          assert.strictEqual(Object.keys(page).length, 1)
          assert.strictEqual(page.template, 'page.pug')

          assertDoesNotExist(readmePath, `${readmePath} should not exist, because there should be no content.`)

          assertDoesNotExist(pageMdPath, `${pageMdPath} should have been deleted.`)
        })
      })

      describe('and pages with just content', () => {
        it('should replace page.md file with README.md', async () => {
          outputFileSync(pageMdPath, `This is the homepage content.`)
          await runCommand(migratePath, 'uiengine migrate page.md')

          assertContentMatches(readmePath, 'This is the homepage content.\n')

          assertDoesNotExist(configPath, `${configPath} should not exist, because there should be no attributes.`)

          assertDoesNotExist(pageMdPath, `${pageMdPath} should have been deleted.`)
        })
      })
    })

    describe('with entity.yml migration', () => {
      const entitiesPath = join(migratePath, 'entities')
      const ymlPath = join(entitiesPath, 'Entity.yml')
      const jsPath = join(entitiesPath, 'Entity.js')

      afterEach(() => { removeSync(entitiesPath) })

      it('should replace Entity.yml file with Entity.js', async () => {
        outputFileSync(ymlPath, `name:\n  type: String\n  description: Product name or title\n  required: true\namount:\n  type: Number`)

        const out = await runCommand(migratePath, 'uiengine migrate entity.yml')
        assertMatches(out, 'The Entity.yml files have been replaced with Entity.js files.')

        assertExists(jsPath)
        const entity = require(jsPath)
        assert.strictEqual(Object.keys(entity).length, 2)
        assert.strictEqual(entity.name.type, 'String')
        assert.strictEqual(entity.name.description, 'Product name or title')
        assert.strictEqual(entity.name.required, true)

        assert.strictEqual(entity.amount.type, 'Number')

        assertDoesNotExist(ymlPath, `${ymlPath} should have been deleted.`)
      })

      it('should report info if there are no Entity.yml files to migrate', async () => {
        const out = await runCommand(migratePath, 'uiengine migrate entity.yml')
        assertMatches(out, 'No Entity.yml files to migrate.')
      })
    })

    describe('with data.yml migration', () => {
      const dataPath = join(migratePath, 'data')
      const ymlPath = join(dataPath, 'data.yml')
      const jsPath = join(dataPath, 'data.js')

      afterEach(() => { removeSync(dataPath) })

      it('should replace data.yml file with data.js', async () => {
        outputFileSync(ymlPath, `name: "Test"`)

        const out = await runCommand(migratePath, 'uiengine migrate data.yml')
        assertMatches(out, 'The data.yml files have been replaced with data.js files.')

        assertExists(jsPath)
        const entity = require(jsPath)
        assert.strictEqual(Object.keys(entity).length, 1)
        assert.strictEqual(entity.name, 'Test')

        assertDoesNotExist(ymlPath, `${ymlPath} should have been deleted.`)
      })

      it('should report info if there are no data.yml files to migrate', async () => {
        const out = await runCommand(migratePath, 'uiengine migrate data.yml')
        assertMatches(out, 'No data.yml files to migrate.')
      })
    })
  })
})
