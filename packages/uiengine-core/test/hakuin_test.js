/* global describe, it */
const assert = require('assert')

const Hakuin = require('../lib/index')

const testConfigPath = './test/project/project.yml'

describe('Hakuin', () => {
  describe('#generate', () => {
    it('should generate site', (done) => {
      const opts = { config: testConfigPath }
      Hakuin.generate(opts)
        .then(function (result) {
          assert.equal(true, result)
          done()
        })
        .catch(done)
    })
  })
})
