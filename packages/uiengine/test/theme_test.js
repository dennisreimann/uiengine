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
  it('should throw error if the theme cannot be resolved', done => {
    Theme.setup({ config: { theme: { module: 'doesnotexist' } } })
      .catch(error => {
        assert(error)
        done()
      })
  })

  describe('#setup', () => {
    afterEach(() => { fs.removeSync(testTmpPath) })

    it('should call the themes setup function', function (done) {
      this.sinon.stub(TestTheme, 'setup')

      Theme.setup(state)
        .then(() => {
          const markdownIt = require('../src/util/markdown').markdownIt
          const expectedOptions = Object.assign({}, testThemeOptions, { markdownIt })

          assert(TestTheme.setup.calledOnce)
          assert(TestTheme.setup.calledWithMatch(expectedOptions))

          done()
        })
        .catch(done)
    })
  })

  describe('#render', () => {
    it('should call the themes render function with the options, state and change', function (done) {
      this.sinon.stub(TestTheme, 'render').returns('')

      const change = { file: 'component.md', action: 'created', type: 'component', item: 'componentId' }

      Theme.render(state, change)
        .then(() => {
          assert(TestTheme.render.calledOnce)
          assert(TestTheme.render.calledWithMatch(testThemeOptions, state, change))

          done()
        })
        .catch(done)
    })
  })

  describe('#teardown', () => {
    it('should call the themes teardown function', function (done) {
      this.sinon.stub(TestTheme, 'teardown')

      Theme.teardown(state)
        .then(() => {
          assert(TestTheme.teardown.calledOnce)
          assert(TestTheme.teardown.calledWithMatch(testThemeOptions))

          done()
        })
        .catch(done)
    })
  })
})
