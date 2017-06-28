require('mocha-sinon')()

const fs = require('fs-extra')
const path = require('path')
const assert = require('assert')
const assertExists = require('./support/assertExists')
const Theme = require('../src/theme')

const tmpPath = path.resolve(__dirname, 'tmp')
const target = path.resolve(tmpPath, 'site')
const testThemePath = path.resolve(__dirname, 'fixtures', 'test-theme')
const testThemeOptions = { opt1: 1, opt2: 2 }
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
    afterEach(() => { fs.removeSync(tmpPath) })

    it('should call the themes setup function', function (done) {
      this.sinon.stub(TestTheme, 'setup')

      Theme.setup(state)
        .then(() => {
          const markdownIt = require('../src/util/markdown').markdownIt
          const expectedOptions = Object.assign({}, testThemeOptions, { markdownIt })

          assert(TestTheme.setup.calledOnce)
          assert(TestTheme.setup.calledWith(expectedOptions))

          done()
        })
        .catch(done)
    })

    it('should copy the themes static files', done => {
      Theme.setup(state)
        .then(() => {
          assertExists(path.join(target, '_theme-assets', 'test.css'))

          done()
        })
        .catch(done)
    })
  })

  describe('#render', () => {
    it('should call the themes render function with the options, the template id and data', function (done) {
      this.sinon.stub(TestTheme, 'render').returns('')

      const templateId = 'my-template'
      const data = { myData: 1 }

      Theme.render(state, templateId, data)
        .then(() => {
          assert(TestTheme.render.calledOnce)
          assert(TestTheme.render.calledWith(testThemeOptions, templateId, data))

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
          assert(TestTheme.teardown.calledWith(testThemeOptions))

          done()
        })
        .catch(done)
    })
  })
})
