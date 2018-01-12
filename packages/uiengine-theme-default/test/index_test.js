require('mocha-sinon')()

const fs = require('fs-extra')
const path = require('path')
const assert = require('assert')
const assertExists = require('../../../test/support/assertExists')
const assertMatches = require('../../../test/support/assertMatches')
const assertContentMatches = require('../../../test/support/assertContentMatches')
const DefaultTheme = require('../src/index')

const { testTmpPath } = require('../../../test/support/paths')
const target = path.resolve(testTmpPath, 'site')
const indexFile = path.join(target, 'index.html')
const testThemeOptions = { target, markdownIt: { set: function () {} } }

describe('DefaultTheme', () => {
  afterEach(() => { fs.removeSync(testTmpPath) })

  describe('#setup', () => {
    it('should copy the themes static files', done => {
      DefaultTheme.setup(testThemeOptions)
        .then(() => {
          assertExists(path.join(target, '_uiengine-theme', 'styles', 'uiengine-default.css'))

          done()
        })
        .catch(done)
    })

    it('should configure the markdown parser', function (done) {
      const markdownIt = {
        set: this.sinon.stub()
      }

      const opts = Object.assign({}, testThemeOptions, { markdownIt })

      DefaultTheme.setup(opts)
        .then(() => {
          assert(markdownIt.set.calledOnce)

          done()
        })
        .catch(done)
    })

    it('should throw error if the target is not set', done => {
      const opts = Object.assign({}, testThemeOptions)
      delete opts.target

      DefaultTheme.setup(opts)
        .catch(error => {
          assert(error)
          done()
        })
    })

    it('should throw error with debug details if the debug flag is set', done => {
      const opts = Object.assign({}, testThemeOptions)
      opts.debug = true
      delete opts.target

      DefaultTheme.setup(opts)
        .catch(error => {
          assertMatches(error.message, '"debug": true')
          assertMatches(error.message, '"markdownIt": {}')

          done()
        })
    })
  })

  describe('#render', () => {
    it('should render the index.html file including the state', done => {
      DefaultTheme.render(testThemeOptions, { config: { name: 'Test Render' } })
        .then(() => {
          assertContentMatches(indexFile, 'Test Render')

          done()
        })
        .catch(done)
    })

    it('should include the set locale if the passed language is available', done => {
      const opts = Object.assign({}, testThemeOptions, { lang: 'de' })

      DefaultTheme.render(opts, {})
        .then(() => {
          assertContentMatches(indexFile, 'html lang="de"')

          done()
        })
        .catch(done)
    })

    it('should default to english locale if the passed language is not available', done => {
      const opts = Object.assign({}, testThemeOptions, { lang: 'pl' })

      DefaultTheme.render(opts, {})
        .then(() => {
          assertContentMatches(indexFile, 'html lang="en"')

          done()
        })
        .catch(done)
    })

    it('should throw error if the template cannot be rendered', done => {
      DefaultTheme.render() // no options and state -> error
        .catch(error => {
          assert(error)
          done()
        })
    })
  })
})
