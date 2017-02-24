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

    it('should include yaml files', done => {
      Yaml.fromFile('./test/fixtures/yaml-with-includes.yml')
        .then(data => {
          assert.equal(data.included_yaml.name, 'Index')
          assert.equal(data.included_yaml.number, 2)
          done()
        })
        .catch(done)
    })

    it('should include json files', done => {
      Yaml.fromFile('./test/fixtures/yaml-with-includes.yml')
        .then(data => {
          assert.equal(data.included_json.name, 'JSON')
          assert.equal(data.included_json.number, 3)
          done()
        })
        .catch(done)
    })

    it('should include js files', done => {
      Yaml.fromFile('./test/fixtures/yaml-with-includes.yml')
        .then(data => {
          assert.equal(data.included_js.name, 'Included JS')
          assert.equal(data.included_js.number, 4)
          done()
        })
        .catch(done)
    })

    it('should include markdown files', done => {
      Yaml.fromFile('./test/fixtures/yaml-with-includes.yml')
        .then(data => {
          assert.equal(data.included_md, '<h1>Homepage</h1>\n<p>Welcome!</p>')
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

    it('should parse with custom markdown type', done => {
      Yaml.fromString('content: !markdown |\n  # Headline\n  Text paragraph')
        .then(data => {
          assert.equal(data.content, '<h1>Headline</h1>\n<p>Text paragraph</p>')
          done()
        })
        .catch(done)
    })
  })
})
