const assert = require('assert')
const { join } = require('path')
const { ensureDirSync, removeSync } = require('fs-extra')
const { runCommand } = require('./support/util')
const { assertContentMatches, assertExists, assertMatches } = require('../../../test/support/asserts')
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
      assertMatches(stdout, 'The following files were created:\n\n- uiengine.config.js\n- src/templates/uiengine.html\n- uiengine/pages/page.md')

      // config
      const configPath = join(testPath, 'uiengine.config.js')
      assertExists(configPath)

      const config = readConfigFile(configPath)

      assert.strictEqual(config.name, 'Cli Project')
      assert.strictEqual(config.source.components, './src/components')
      assert.strictEqual(config.source.templates, './src/templates')
      assert.strictEqual(config.source.pages, './uiengine/pages')
      assert.strictEqual(config.source.data, './uiengine/data')
      assert.strictEqual(config.source.entities, './uiengine/entities')
      assert.strictEqual(config.target, './dist')
      assert.strictEqual(config.adapters.html, '@uiengine/adapter-html')
      assert.strictEqual(config.template, 'uiengine.html')

      // homepage
      const homepagePath = join(testPath, 'uiengine/pages/page.md')
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
      assertMatches(stdout, 'The following files already existed:\n\n- uiengine.config.js\n- src/templates/uiengine.html\n- uiengine/pages/page.md')
    })

    describe('with force flag', () => {
      it('should overwrite existing files', async () => {
        const stdout = await runCommand(testPath, 'uiengine init -f')

        // stdout
        assertMatches(stdout, 'The following files were created:\n\n- uiengine.config.js\n- src/templates/uiengine.html\n- uiengine/pages/page.md')
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
        assertExists(join(testPath, 'uiengine/pages/patterns/page.md'))
        assertExists(join(testPath, 'uiengine/pages/patterns/elements/page.md'))
        assertExists(join(testPath, 'uiengine/pages/patterns/components/page.md'))

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
      const atomsPagePath = 'uiengine/pages/atoms/page.md'
      const moleculesPagePath = 'uiengine/pages/molecules/page.md'

      // stdout
      assertMatches(stdout, 'Pages created')
      assertMatches(stdout, `The following files were created:\n\n- ${atomsPagePath}\n- ${moleculesPagePath}`)

      //  page files
      assertContentMatches(join(testPath, atomsPagePath), '# Atoms')
      assertContentMatches(join(testPath, moleculesPagePath), '# Molecules')
    })

    it('should not overwrite existing files', async () => {
      const stdout = await runCommand(testPath, 'uiengine page atoms molecules organisms')
      const atomsPagePath = 'uiengine/pages/atoms/page.md'
      const moleculesPagePath = 'uiengine/pages/molecules/page.md'
      const organismsPagePath = 'uiengine/pages/organisms/page.md'

      // stdout
      assertMatches(stdout, `The following files already existed:\n\n- ${atomsPagePath}\n- ${moleculesPagePath}`)
      assertMatches(stdout, `The following files were created:\n\n- ${organismsPagePath}`)
    })

    describe('with force flag', () => {
      it('should overwrite existing files ', async () => {
        const stdout = await runCommand(testPath, 'uiengine page atoms molecules --force')
        const atomsPagePath = 'uiengine/pages/atoms/page.md'
        const moleculesPagePath = 'uiengine/pages/molecules/page.md'

        // stdout
        assertMatches(stdout, `The following files were created:\n\n- ${atomsPagePath}\n- ${moleculesPagePath}`)
      })
    })
  })

  describe('component command', () => {
    it('should create the basic files for a new component', async () => {
      const stdout = await runCommand(testPath, 'uiengine component list')

      // stdout
      assertMatches(stdout, 'List created')
      assertMatches(stdout, `The following files were created:\n\n- src/components/list/component.md`)

      // component file
      const markdownPath = join(testPath, 'src/components/list/component.md')
      assertContentMatches(markdownPath, 'title: List')
    })

    it('should not overwrite existing files', async () => {
      const stdout = await runCommand(testPath, 'uiengine component button default primary')

      // stdout
      assertMatches(stdout, `The following files already existed:\n\n- src/components/button/component.md`)
    })

    describe('with force flag', () => {
      it('should overwrite existing files ', async () => {
        const stdout = await runCommand(testPath, 'uiengine component button --force')

        // stdout
        assertMatches(stdout, `The following files were created:\n\n- src/components/button/component.md`)
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
      assertContentMatches(indexPath, 'window.UIengine.state = {"config":{"name":"Cli Project"')
      assertContentMatches(indexPath, '/_assets/scripts/uiengine')
      assertContentMatches(indexPath, '/_assets/styles/uiengine')

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
})
