/* global describe, it */
const assert = require('assert')

const Configuration = require('../lib/configuration')

const testConfigPath = './test/project/project.yml'

describe('Configuration', () => {
  describe('#read', () => {
    it('should return config object', done => {
      Configuration.read(testConfigPath)
        .then(config => {
          assert.equal(config.name, 'Test')
          assert.equal(config.namespace, 'test')
          assert.equal(config.target.site, './test/project/dist/site')
          assert.equal(config.target.assets, './test/project/dist/test')
          assert.equal(config.basedirs.components, './test/project/components')
          assert.equal(config.basedirs.templates, './test/project/templates')
          assert.equal(config.basedirs.includes, './test/project/includes')
          assert.equal(config.basedirs.pages, './test/project/pages')

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
