const assert = require('assert')
const { assertMatches } = require('../../../test/support/asserts')
const { resolve } = require('path')

const { testProjectPath, testProjectTargetPath } = require('../../../test/support/paths')
const Configuration = require('../src/configuration')

// in the tests we have to provide the config option, because the cwd is
// the project root and cosmiconf does not search test/project.
const testConfigPath = resolve(testProjectPath, 'uiengine.config.js')
const opts = { config: testConfigPath }

describe('Configuration', () => {
  describe('#read', () => {
    it('should return config object', async () => {
      const config = await Configuration.read(opts)

      assert.strictEqual(config.name, 'UIengine Sample Project')
      assert.strictEqual(config.version, '1.0.0')
    })

    it('should take options', async () => {
      const optsWithDebug = Object.assign({}, opts, { debug: true })
      const config = await Configuration.read(optsWithDebug)

      assert(config.debug)
    })

    it('should resolve target', async () => {
      const config = await Configuration.read(opts)

      assert.strictEqual(config.target, testProjectTargetPath)
    })

    it('should resolve base and configFile source paths', async () => {
      const config = await Configuration.read(opts)

      assert.strictEqual(config.source.base, resolve(testProjectPath))
      assert.strictEqual(config.source.configFile, resolve(testProjectPath, 'uiengine.config.js'))
    })

    it('should resolve source paths', async () => {
      const config = await Configuration.read(opts)

      assert.strictEqual(config.source.templates, resolve(testProjectPath, 'src', 'templates'))
      assert.strictEqual(config.source.pages, resolve(testProjectPath, 'uiengine', 'pages'))
    })

    it('should resolve components source paths as array', async () => {
      const config = await Configuration.read(opts)

      assert.strictEqual(config.source.components.length, 2)
      assert.strictEqual(config.source.components[0], resolve(testProjectPath, 'src', 'elements'))
      assert.strictEqual(config.source.components[1], resolve(testProjectPath, 'src', 'modules'))
    })

    it('should resolve components source paths as array if string is given', async () => {
      const opts = { config: resolve(testProjectPath, 'uiengine-source-components-string.config.js') }
      const config = await Configuration.read(opts)

      assert.strictEqual(config.source.components.length, 1)
      assert.strictEqual(config.source.components[0], resolve(testProjectPath, 'src', 'components'))
    })

    it('should resolve UI', async () => {
      const config = await Configuration.read(opts)

      assert.strictEqual(config.ui.customStylesFile, '/assets/styles/uiengine-custom-styles.css')
    })

    it('should resolve adapters', async () => {
      const config = await Configuration.read(opts)

      assert.strictEqual(config.adapters.pug.module, '@uiengine/adapter-pug')
      assert.strictEqual(config.adapters.pug.options.pretty, true)
    })

    it('should resolve default UI if no object is given', async () => {
      const opts = { config: resolve(testProjectPath, 'uiengine-default-ui.config.js') }
      const config = await Configuration.read(opts)

      assert.strictEqual(Object.keys(config.ui).length, 0)
    })

    it('should resolve default themes if no array is given', async () => {
      const opts = { config: resolve(testProjectPath, 'uiengine-default-themes.config.js') }
      const config = await Configuration.read(opts)

      assert.strictEqual(config.themes.length, 1)
      assert.strictEqual(config.themes[0].id, '_default')
      assert.strictEqual(config.themes[0].title, 'Default')
    })

    it('should resolve adapters', async () => {
      const config = await Configuration.read(opts)

      assert.strictEqual(config.adapters.pug.module, '@uiengine/adapter-pug')
      assert.strictEqual(config.adapters.pug.options.pretty, true)
      assert.strictEqual(config.adapters.pug.options.basedir, resolve(testProjectPath, 'src'))
      assert.strictEqual(config.adapters.jsx.module, '@uiengine/adapter-webpack')
      assert.strictEqual(config.adapters.hbs.module, '@uiengine/adapter-handlebars')
      assert.strictEqual(Object.keys(config.adapters.hbs.options).length, 0)
    })

    it('should throw error if config does not exist', async () => {
      try {
        await Configuration.read({ config: 'doesnotexist.config.js' })
      } catch (error) {
        assert(error)

        assertMatches(error.message, 'Could not read UIengine configuration')
      }
    })
  })
})
