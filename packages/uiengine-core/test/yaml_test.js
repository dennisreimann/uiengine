/* global describe, it */
const assert = require('assert')

const Yaml = require('../lib/util/yaml')

describe('Yaml', () => {
  describe('#readFile', () => {
    it('should return parsed yaml', (done) => {
      Yaml.readFile('./test/project/pages/page.yml')
        .then(data => {
          assert.equal(data.name, 'Index')
          done()
        })
        .catch(done)
    })
  })
})
