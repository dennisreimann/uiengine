/* global describe, it */
const path = require('path')
const assert = require('assert')

const Configuration = require('../lib/configuration')

const themePath = path.resolve(__dirname, '..', 'theme')
const sampleProjectPath = path.resolve(__dirname, '..', 'sample_project')
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
          assert.equal(config.target.site, path.resolve(sampleProjectPath, 'dist'))
          assert.equal(config.target.assets, path.resolve(sampleProjectPath, 'dist', 'assets'))
          assert.equal(config.source.components, path.resolve(sampleProjectPath, 'src', 'components'))
          assert.equal(config.source.templates, path.resolve(sampleProjectPath, 'src', 'templates'))
          assert.equal(config.source.pages, path.resolve(sampleProjectPath, 'src', 'pages'))

          done()
        })
        .catch(done)
    })

    it('should resolve theme', done => {
      Configuration.read(testConfigPath)
        .then(config => {
          assert.equal(config.theme, themePath)

          done()
        })
        .catch(done)
    })

    it('should resolve adapters', done => {
      Configuration.read(testConfigPath)
        .then(config => {
          assert.equal(config.adapters.pug.module, path.resolve(sampleProjectPath, 'node_modules', 'uiengine-adapter-pug'))
          assert.equal(config.adapters.pug.options.pretty, true)
          assert.equal(config.adapters.pug.options.basedir, path.resolve(sampleProjectPath, 'src', 'components'))
          assert.equal(config.adapters.jsx.module, path.resolve(sampleProjectPath, 'node_modules', 'uiengine-adapter-react'))
          assert.equal(config.adapters.hbs.module, path.resolve(sampleProjectPath, 'node_modules', 'uiengine-adapter-handlebars'))
          assert.equal(Object.keys(config.adapters.jsx.options).length, 0)
          assert.equal(Object.keys(config.adapters.hbs.options).length, 0)

          done()
        })
        .catch(done)
    })

    it('should resolve templates', done => {
      Configuration.read(testConfigPath)
        .then(config => {
          assert.equal(config.templates.variation, 'variation-preview.pug')

          done()
        })
        .catch(done)
    })
  })
})
