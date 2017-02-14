/* global describe, it */
const assert = require('assert')

const Yaml = require('../src/util/yaml')

describe('Yaml', () => {
  describe('#fromFile', () => {
    it('should return parsed yaml', done => {
      Yaml.fromFile('./test/fixtures/yaml.yml')
        .then(data => {
          assert.equal(data.name, 'Index')
          assert.equal(data.number, 2)
          done()
        })
        .catch(done)
    })
  })

  describe('#fromString', () => {
    it('should return parsed yaml', done => {
      Yaml.fromString('name: Index\nnumber: 2')
        .then(data => {
          assert.equal(data.name, 'Index')
          assert.equal(data.number, 2)
          done()
        })
        .catch(done)
    })
  })
})
