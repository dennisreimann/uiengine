/* global describe, it */
const path = require('path')
const assert = require('assert')

const Configuration = require('../src/configuration')

const sampleProjectPath = path.resolve(__dirname, 'project')
const testConfigPath = path.resolve(sampleProjectPath, 'uiengine.yml')

describe('Configuration', () => {
  describe('#read', () => {
    it('should return config object', done => {
      Configuration.read(testConfigPath)
        .then(config => {
          assert.equal(config.name, 'UIengine Sample Project')
          assert.equal(config.version, '1.0.0')

          done()
        })
        .catch(done)
    })

    it('should take options', done => {
      const opts = { debug: true }

      Configuration.read(testConfigPath, opts)
        .then(config => {
          assert(config.debug)

          done()
        })
        .catch(done)
    })

    it('should resolve target and source paths', done => {
      Configuration.read(testConfigPath)
        .then(config => {
          assert.equal(config.target, path.resolve(sampleProjectPath, 'dist'))
          assert.equal(config.source.components, path.resolve(sampleProjectPath, 'src', 'components'))
          assert.equal(config.source.templates, path.resolve(sampleProjectPath, 'src', 'templates'))
          assert.equal(config.source.pages, path.resolve(sampleProjectPath, 'src', 'uiengine', 'pages'))
          assert.equal(config.source.schema, path.resolve(sampleProjectPath, 'src', 'uiengine', 'schema'))
          assert.equal(config.source.data, path.resolve(sampleProjectPath, '..', 'fixtures'))
          assert.equal(config.source.base, path.resolve(sampleProjectPath))
          assert.equal(config.source.configFile, testConfigPath)

          done()
        })
        .catch(done)
    })

    it('should resolve theme', done => {
      Configuration.read(testConfigPath)
        .then(config => {
          assert.equal(config.theme.module, 'uiengine-theme-default')
          assert.equal(config.theme.options.skin, 'uiengineering')

          done()
        })
        .catch(done)
    })

    it('should resolve default theme if no theme is given', done => {
      Configuration.read(path.resolve(sampleProjectPath, 'uiengine-use-default-theme.yml'))
        .then(config => {
          assert.equal(config.theme.module, 'uiengine-theme-default')
          assert.equal(Object.keys(config.theme.options).length, 0)

          done()
        })
        .catch(done)
    })

    it('should resolve adapters', done => {
      Configuration.read(testConfigPath)
        .then(config => {
          assert.equal(config.adapters.pug.module, 'uiengine-adapter-pug')
          assert.equal(config.adapters.pug.options.pretty, true)
          assert.equal(config.adapters.pug.options.basedir, path.resolve(sampleProjectPath, 'src', 'components'))
          assert.equal(config.adapters.jsx.module, 'uiengine-adapter-react')
          assert.equal(config.adapters.hbs.module, 'uiengine-adapter-handlebars')
          assert.equal(Object.keys(config.adapters.jsx.options).length, 0)
          assert.equal(Object.keys(config.adapters.hbs.options).length, 0)

          done()
        })
        .catch(done)
    })

    it('should resolve templates', done => {
      Configuration.read(testConfigPath)
        .then(config => {
          assert.equal(config.templates.variant, path.resolve(sampleProjectPath, 'src', 'templates', 'variant-preview.pug'))

          done()
        })
        .catch(done)
    })

    it('should register templates', done => {
      Configuration.read(testConfigPath)
        .then(config => {
          assert.equal(config.templates['variant-preview'], path.resolve(sampleProjectPath, 'src', 'templates', 'variant-preview.pug'))
          assert.equal(config.templates['other-page'], path.resolve(sampleProjectPath, 'src', 'templates', 'other-page.pug'))
          assert.equal(config.templates['common/include'], path.resolve(sampleProjectPath, 'src', 'templates', 'common', 'include.pug'))

          done()
        })
        .catch(done)
    })
  })
})
