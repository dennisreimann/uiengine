require('mocha-sinon')()

const fs = require('fs-extra')
const { resolve } = require('path')
const assert = require('assert')
const Theme = require('../src/theme')

const { testTmpPath } = require('../../../test/support/paths')
const target = resolve(testTmpPath, 'site')
const testThemePath = resolve(__dirname, 'fixtures', 'test-theme')
const testThemeOptions = { opt1: 1, opt2: 2, target }
const TestTheme = require(testThemePath)

const state = {
  config: {
    target,
    theme: {
      module: testThemePath,
      options: testThemeOptions
    }
  }
}

describe('Theme', () => {
  it('should throw error if the theme cannot be resolved', async () => {
    try {
      await Theme.setup({ config: { theme: { module: 'doesnotexist' } } })
    } catch (error) {
      assert(error)
    }
  })

  describe('#setup', () => {
    afterEach(() => { fs.removeSync(testTmpPath) })

    it('should call the themes setup function', async function () {
      this.sinon.stub(TestTheme, 'setup')
      await Theme.setup(state)
      const markdownIt = require('../src/util/markdown').markdownIt
      const expectedOptions = Object.assign({}, testThemeOptions, { markdownIt })

      assert(TestTheme.setup.calledOnce)
      assert(TestTheme.setup.calledWithMatch(expectedOptions))
    })
  })

  describe('#render', () => {
    it('should call the themes render function with the options, state and change', async function () {
      this.sinon.stub(TestTheme, 'render').returns('')
      const change = { file: 'component.md', action: 'created', type: 'component', item: 'componentId' }
      await Theme.render(state, change)

      assert(TestTheme.render.calledOnce)
      assert(TestTheme.render.calledWithMatch(testThemeOptions, state, change))
    })
  })

  describe('#teardown', () => {
    it('should call the themes teardown function', async function () {
      this.sinon.stub(TestTheme, 'teardown')
      await Theme.teardown(state)

      assert(TestTheme.teardown.calledOnce)
      assert(TestTheme.teardown.calledWithMatch(testThemeOptions))
    })
  })
})
