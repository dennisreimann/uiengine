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
describe('CLI @nowatch', function () {
  this.timeout(10000)

  before(() => { ensureDirSync(testPath) })
  after(() => { removeSync(testTmpPath) })

  describe('init command', () => {
    const configFile = 'uiengine.config.js'
    const templateFile = join('src', 'templates', 'uiengine.html')
    const pageConfFile = join('uiengine', 'page.config.js')
    const pageDocsFile = join('uiengine', 'README.md')

    it('should create a basic structure and config file', async () => {
      const stdout = await runCommand(testPath, 'uiengine init')

      // stdout
      assertMatches(stdout, 'Initialized Cli Project')
      assertMatches(stdout, `The following files were created:\n\n- ${configFile}\n- ${templateFile}\n- ${pageConfFile}\n- ${pageDocsFile}`)

      // config
      const configPath = join(testPath, configFile)
      assertExists(configPath)

      const config = readConfigFile(configPath)

      assert.strictEqual(config.name, 'Cli Project')
      assert.strictEqual(config.source.components, './src/components')
      assert.strictEqual(config.source.templates, './src/templates')
      assert.strictEqual(config.source.pages, './uiengine')
      assert.strictEqual(config.target, './dist')
      assert.strictEqual(config.adapters.html, '@uiengine/adapter-html')
      assert.strictEqual(config.template, 'uiengine.html')

      // homepage
      const homepagePath = join(testPath, pageDocsFile)
      assertContentMatches(homepagePath, 'It looks like you have just set up this project.')

      // preview
      const previewPath = join(testPath, templateFile)
      assertContentMatches(previewPath, '<!-- uiengine:title -->')
      assertContentMatches(previewPath, '<!-- uiengine:class -->')
      assertContentMatches(previewPath, '<!-- uiengine:content -->')
      assertContentMatches(previewPath, '<!-- uiengine:foot -->')
      assertContentMatches(previewPath, 'add your custom styles here')
      assertContentMatches(previewPath, 'add your custom scripts here')
    })

    it('should not overwrite existing files', async () => {
      const stdout = await runCommand(testPath, 'uiengine init')

      // stdout
      assertMatches(stdout, `The following files already existed:\n\n- ${configFile}\n- ${templateFile}\n- ${pageConfFile}\n- ${pageDocsFile}`)
    })

    describe('with force flag', () => {
      it('should overwrite existing files', async () => {
        const stdout = await runCommand(testPath, 'uiengine init -f')

        // stdout
        assertMatches(stdout, `The following files were created:\n\n- ${configFile}\n- ${templateFile}\n- ${pageConfFile}\n- ${pageDocsFile}`)
      })
    })

    describe('with override flag', () => {
      it('should override config parameters', async () => {
        // remove files from previous run
        removeSync(testTmpPath)
        ensureDirSync(testPath)

        await runCommand(testPath, 'uiengine init --override.name=OVERRIDE --override.source.pages=patternlib --override.target=./dist/override-target --override.ui.lang=de')

        const configPath = join(testPath, configFile)
        const config = readConfigFile(configPath)

        assert.strictEqual(config.name, 'OVERRIDE')
        assert.strictEqual(config.source.pages, 'patternlib')
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
        assertExists(join(testPath, join('uiengine', 'patterns', 'page.config.js')))
        assertExists(join(testPath, join('uiengine', 'patterns', 'README.md')))
        assertExists(join(testPath, join('uiengine', 'patterns', 'elements', 'page.config.js')))
        assertExists(join(testPath, join('uiengine', 'patterns', 'components', 'page.config.js')))

        // component files
        assertExists(join(testPath, join('src', 'components', 'button')))
        assertExists(join(testPath, join('src', 'components', 'copytext')))
        assertExists(join(testPath, join('src', 'components', 'heading')))
        assertExists(join(testPath, join('src', 'components', 'teaser')))
      })
    })
  })

  describe('page command', () => {
    it('should create the page files', async () => {
      const stdout = await runCommand(testPath, 'uiengine page atoms molecules')
      const atomsConfigPath = join('uiengine', 'atoms', 'page.config.js')
      const atomsReadmePath = join('uiengine', 'atoms', 'README.md')
      const moleculesConfigPath = join('uiengine', 'molecules', 'page.config.js')
      const moleculesReadmePath = join('uiengine', 'molecules', 'README.md')

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
      const atomsPagePath = join('uiengine', 'atoms', 'page.config.js')
      const atomsReadmePath = join('uiengine', 'atoms', 'README.md')
      const moleculesPagePath = join('uiengine', 'molecules', 'page.config.js')
      const moleculesReadmePath = join('uiengine', 'molecules', 'README.md')
      const organismsPagePath = join('uiengine', 'organisms', 'page.config.js')
      const organismsReadmePath = join('uiengine', 'organisms', 'README.md')

      assertMatches(stdout, `The following files already existed:\n\n- ${atomsPagePath}\n- ${atomsReadmePath}\n- ${moleculesPagePath}\n- ${moleculesReadmePath}`)
      assertMatches(stdout, `The following files were created:\n\n- ${organismsPagePath}\n- ${organismsReadmePath}`)
    })

    describe('with force flag', () => {
      it('should overwrite existing files ', async () => {
        const stdout = await runCommand(testPath, 'uiengine page atoms molecules --force')
        const atomsPagePath = join('uiengine', 'atoms', 'page.config.js')
        const atomsReadmePath = join('uiengine', 'atoms', 'README.md')
        const moleculesPagePath = join('uiengine', 'molecules', 'page.config.js')
        const moleculesReadmePath = join('uiengine', 'molecules', 'README.md')

        assertMatches(stdout, `The following files were created:\n\n- ${atomsPagePath}\n- ${atomsReadmePath}\n- ${moleculesPagePath}\n- ${moleculesReadmePath}`)
      })
    })
  })

  describe('component command', () => {
    const buttonConfigPath = join('src', 'components', 'button', 'component.config.js')
    const buttonReadmePath = join('src', 'components', 'button', 'README.md')
    const listConfigPath = join('src', 'components', 'list', 'component.config.js')
    const listReadmePath = join('src', 'components', 'list', 'README.md')

    it('should create the basic files for a new component', async () => {
      const stdout = await runCommand(testPath, 'uiengine component list')

      // stdout
      assertMatches(stdout, 'List created')
      assertMatches(stdout, `The following files were created:\n\n- ${listConfigPath}\n- ${listReadmePath}`)

      // component file
      assertContentMatches(join(testPath, listConfigPath), 'module.exports = {}')
      assertContentMatches(join(testPath, listReadmePath), '# List')
    })

    it('should not overwrite existing files', async () => {
      const stdout = await runCommand(testPath, 'uiengine component button default primary')

      assertMatches(stdout, `The following files already existed:\n\n- ${buttonConfigPath}\n- ${buttonReadmePath}`)
    })

    describe('with force flag', () => {
      it('should overwrite existing files ', async () => {
        const stdout = await runCommand(testPath, 'uiengine component button --force')

        assertMatches(stdout, `The following files were created:\n\n- ${buttonConfigPath}\n- ${buttonReadmePath}`)
      })
    })
  })

  describe('build command', () => {
    it('should build the site', async () => {
      const stdout = await runCommand(testPath, 'uiengine build')

      // stdout
      assertMatches(stdout, 'Build done')

      // index file
      const indexPath = join(testPath, 'dist', 'index.html')
      assertExists(indexPath)
      assertContentMatches(indexPath, 'window.UIengine = {')
      assertContentMatches(indexPath, 'state: {"config":{"name":"Cli Project"')
      assertContentMatches(indexPath, '/_assets/scripts/main')
      assertContentMatches(indexPath, '/_assets/styles/main')

      // ui
      assertExists(join(testPath, 'dist', '_assets', 'scripts'))
      assertExists(join(testPath, 'dist', '_assets', 'styles'))

      // sketch file
      assertExists(join(testPath, 'dist', '_sketch', '_default.html'))
    })

    it('should build the demo', async () => {
      await runCommand(testPath, 'uiengine init --demo')

      const stdout = await runCommand(testPath, 'uiengine build')

      // stdout
      assertMatches(stdout, 'Build done')

      // variants
      assertExists(join(testPath, 'dist', '_variants', '_default', 'heading', 'title.html-1.html'))
      assertExists(join(testPath, 'dist', '_variants', '_default', 'heading', 'subtitle.html-2.html'))
    })

    describe('with debug flag', () => {
      it('should create the state file', async () => {
        await runCommand(testPath, 'uiengine build -d=1')

        // state file
        assertExists(join(testPath, 'dist', '_state.json'))
      })
    })

    describe('with override flag', () => {
      it('should override config parameters', async () => {
        await runCommand(testPath, 'uiengine build --override.version=123.456.789 --override.target=./dist/override-target --override.ui.lang=de')

        const indexPath = join(testPath, 'dist', 'override-target', 'index.html')

        assertExists(indexPath)
        assertContentMatches(indexPath, '123.456.789')
        assertContentMatches(indexPath, 'html lang="de"')
      })
    })
  })
})
