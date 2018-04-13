const assert = require('assert')
const { join } = require('path')
const { ensureDirSync, removeSync } = require('fs-extra')
const { runCommand } = require('./support/util')
const { assertContentMatches, assertExists, assertMatches } = require('../../../test/support/asserts')
const { testTmpPath } = require('../../../test/support/paths')
const testPath = join(testTmpPath, 'cli-project')

describe('CLI', function () {
  this.timeout(5000)

  before(() => { ensureDirSync(testPath) })
  after(() => { removeSync(testTmpPath) })

  describe('init command', () => {
    it('should create a basic structure and config file', async () => {
      const stdout = await runCommand(testPath, 'uiengine init')

      // stdout
      assertMatches(stdout, 'Initialized Cli Project')
      assertMatches(stdout, 'The following files were created:')
      assertMatches(stdout, 'uiengine.config.js')
      assertMatches(stdout, 'src/uiengine/pages/page.md')
      assertMatches(stdout, 'src/templates/uiengine.html')

      // config
      const configPath = join(testPath, 'uiengine.config.js')
      assertExists(configPath)

      const config = require(configPath)

      assert.equal(config.name, 'Cli Project')
      assert.equal(config.source.components, './src/components')
      assert.equal(config.source.templates, './src/templates')
      assert.equal(config.source.pages, './src/uiengine/pages')
      assert.equal(config.source.data, './src/uiengine/data')
      assert.equal(config.source.entities, './src/uiengine/entities')
      assert.equal(config.target, './dist')
      assert.equal(config.adapters.html, '@uiengine/adapter-html')
      assert.equal(config.template, 'uiengine.html')

      // homepage
      const homepagePath = join(testPath, 'src/uiengine/pages/page.md')
      assertContentMatches(homepagePath, 'It looks like you have just set up this project.')

      // preview
      const previewPath = join(testPath, 'src/templates/uiengine.html')
      assertContentMatches(previewPath, '<!-- uiengine:content -->')
      assertContentMatches(previewPath, 'add your custom styles here')
      assertContentMatches(previewPath, 'add your custom scripts here')
    })
  })

  describe('page command', () => {
    it('should create the page files', async () => {
      const stdout = await runCommand(testPath, 'uiengine page atoms molecules')
      const atomsPagePath = 'src/uiengine/pages/atoms/page.md'
      const moleculesPagePath = 'src/uiengine/pages/molecules/page.md'

      // stdout
      assertMatches(stdout, 'Pages created')
      assertMatches(stdout, 'The following files were created:')
      assertMatches(stdout, atomsPagePath)
      assertMatches(stdout, moleculesPagePath)

      //  page files
      assertContentMatches(join(testPath, atomsPagePath), '# Atoms')
      assertContentMatches(join(testPath, moleculesPagePath), '# Molecules')
    })
  })

  describe('component command', () => {
    it('should create the basic files for a new component', async () => {
      const stdout = await runCommand(testPath, 'uiengine component button default primary')

      // stdout
      assertMatches(stdout, 'Button created')
      assertMatches(stdout, 'The following files were created:')
      assertMatches(stdout, 'src/components/button/component.md')
      assertMatches(stdout, 'src/components/button/button.html')
      assertMatches(stdout, 'src/components/button/variants/default.html')
      assertMatches(stdout, 'src/components/button/variants/primary.html')

      // component file
      const markdownPath = join(testPath, 'src/components/button/component.md')
      assertContentMatches(markdownPath, 'title: Button')
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

      // variants
      assertExists(join(testPath, 'dist/_variants/button/default.html.html'))
      assertExists(join(testPath, 'dist/_variants/button/primary.html.html'))
    })

    describe('with debug flag', () => {
      it('should create the state file', async () => {
        await runCommand(testPath, 'uiengine build -d')

        // state file
        assertExists(join(testPath, 'dist/_state.json'))
      })
    })
  })
})
