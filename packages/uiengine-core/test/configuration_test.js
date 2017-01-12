/* global describe, it */
const assert = require('assert')

const Configuration = require('../lib/configuration')

const testConfigPath = './test/support/test-config.yml'

describe('Configuration', () => {
  describe('#read', () => {
    it('should return config object', () => {
      const config = Configuration.read(testConfigPath)

      assert(typeof (config) === 'object')
      assert.equal(config.name, 'Test')
      assert.equal(config.namespace, 'test')

      assert(typeof (config.target) === 'object')
      assert.equal(config.target.site, './dist/site')
      assert.equal(config.target.assets, './dist/test')

      assert(typeof (config.basedirs) === 'object')
      assert.equal(config.basedirs.components, './src/components')
      assert.equal(config.basedirs.templates, './src/templates')
      assert.equal(config.basedirs.includes, './site/includes')
      assert.equal(config.basedirs.pages, './site/pages')
    })

    it('should take options', () => {
      const opts = { debug: true }
      const config = Configuration.read(testConfigPath, opts)

      assert(config.debug)
    })
  })
})
