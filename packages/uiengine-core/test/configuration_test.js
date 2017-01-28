/* global describe, it */
const path = require('path')
const assert = require('assert')

const Configuration = require('../lib/configuration')

const testConfigPath = path.resolve(__dirname, '../sample_project/uiengine.yml')

describe('Configuration', () => {
  describe('#read', () => {
    it('should return config object', done => {
      Configuration.read(testConfigPath)
        .then(config => {
          assert.equal(config.name, 'UIengine sample')
          assert(config.target.site.endsWith('sample_project/dist'))
          assert(config.target.assets.endsWith('sample_project/dist/assets'))
          assert(config.source.components.endsWith('sample_project/components'))
          assert(config.source.templates.endsWith('sample_project/templates'))
          assert(config.source.includes.endsWith('sample_project/includes'))
          assert(config.source.pages.endsWith('sample_project/pages'))

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
