require('mocha-sinon')()

const fs = require('fs-extra')
const { join, resolve } = require('path')
const assert = require('assert')
const assertExists = require('../../../test/support/assertExists')
const assertMatches = require('../../../test/support/assertMatches')
const assertContentMatches = require('../../../test/support/assertContentMatches')
const DefaultTheme = require('../src/index')

const { testTmpPath } = require('../../../test/support/paths')
const target = resolve(testTmpPath, 'site')
const indexFile = join(target, 'index.html')
const testThemeOptions = { target, markdownIt: { set: function () {} } }

describe('DefaultTheme', () => {
  afterEach(() => { fs.removeSync(testTmpPath) })

  describe('#setup', () => {
    it('should copy the themes static files', async () => {
      await DefaultTheme.setup(testThemeOptions)

      assertExists(join(target, '_uiengine-theme', 'scripts'))
      assertExists(join(target, '_uiengine-theme', 'styles'))
    })

    it('should configure the markdown parser', async function () {
      const markdownIt = { set: this.sinon.stub() }
      const opts = Object.assign({}, testThemeOptions, { markdownIt })
      await DefaultTheme.setup(opts)

      assert(markdownIt.set.calledOnce)
    })

    it('should throw error if the target is not set', async () => {
      const opts = Object.assign({}, testThemeOptions)
      delete opts.target

      try {
        await DefaultTheme.setup(opts)
      } catch (error) {
        assert(error)
      }
    })

    it('should throw error with debug details if the debug flag is set', async () => {
      const opts = Object.assign({}, testThemeOptions)
      opts.debug = true
      delete opts.target

      try {
        await DefaultTheme.setup(opts)
      } catch (error) {
        assertMatches(error.message, '"debug": true')
        assertMatches(error.message, '"markdownIt": {}')
      }
    })
  })

  describe('#render', async () => {
    it('should render the index.html file including the state', async () => {
      await DefaultTheme.render(testThemeOptions, { config: { name: 'Test Render' } })

      assertContentMatches(indexFile, 'Test Render')
    })

    it('should render the sketch output including the colors', async () => {
      const state = {
        pages: {
          colors: {
            tokens: [
              {
                type: 'color',
                name: 'Blanched Almond',
                value: 'BlanchedAlmond'
              }
            ]
          }
        }
      }
      const sketch = await DefaultTheme.render(testThemeOptions, state, null, 'sketch')

      assertMatches(sketch, 'BlanchedAlmond')
      assertMatches(sketch, 'Blanched Almond')
    })

    it('should render the sketch output including the variants', async () => {
      const state = {
        components: {
          button: {
            title: 'Button',
            variants: [
              {
                title: 'Primary',
                rendered: '<button class="button button--primary">Call To Action</button>'
              }
            ]
          }
        }
      }
      const sketch = await DefaultTheme.render(testThemeOptions, state, null, 'sketch')

      assertMatches(sketch, 'Button/Primary')
      assertMatches(sketch, '<button class="button button--primary">Call To Action</button>')
    })

    it('should include the set locale if the passed language is available', async () => {
      const opts = Object.assign({}, testThemeOptions, { lang: 'de' })
      await DefaultTheme.render(opts, {})

      assertContentMatches(indexFile, 'html lang="de"')
    })

    it('should default to english locale if the passed language is not available', async () => {
      const opts = Object.assign({}, testThemeOptions, { lang: 'pl' })
      await DefaultTheme.render(opts, {})

      assertContentMatches(indexFile, 'html lang="en"')
    })

    it('should throw error if the template cannot be rendered', async () => {
      try {
        await DefaultTheme.render()
      } catch (error) {
        assert(error)
      }
    })
  })
})
