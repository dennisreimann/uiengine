/* global describe, it */
const path = require('path')
const assert = require('assert')

const Configuration = require('../lib/configuration')

const sampleProjectPath = path.resolve(__dirname, '..', 'sample_project')
const testConfigPath = path.resolve(sampleProjectPath, 'uiengine.yml')

describe('Configuration', () => {
  describe('#read', () => {
    it('should return config object', done => {
      Configuration.read(testConfigPath)
        .then(config => {
          assert.equal(config.name, 'UIengine Sample Project')
          assert.equal(config.version, '1.0')
          assert.equal(config.target.site, path.resolve(sampleProjectPath, 'dist'))
          assert.equal(config.target.assets, path.resolve(sampleProjectPath, 'dist', 'assets'))
          assert.equal(config.source.components, path.resolve(sampleProjectPath, 'src', 'components'))
          assert.equal(config.source.templates, path.resolve(sampleProjectPath, 'src', 'templates'))
          assert.equal(config.source.pages, path.resolve(sampleProjectPath, 'src', 'pages'))

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
  })
})
