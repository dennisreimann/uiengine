require('mocha-sinon')()

const { readFileSync } = require('fs')
const { join, resolve } = require('path')
const assert = require('assert')

const Parsing = require('../src/util/parsing')

const filePath = resolve(__dirname, 'fixtures', 'yaml.yml')
const fileContent = readFileSync(filePath, 'utf8')

const sourcePaths = {
  base: __dirname,
  data: join(__dirname, 'fixtures')
}

describe('Parsing', () => {
  describe('#fromFileSync', () => {
    it('should call the given parse function with the file content', function () {
      const parseFn = this.sinon.stub()

      Parsing.fromFileSync(parseFn, filePath, sourcePaths)

      assert(parseFn.calledOnce)
      assert(parseFn.calledWith(fileContent, filePath, sourcePaths))
    })
  })

  describe('#fromFile', () => {
    it('should call the given parse function with the file content', function (done) {
      const parseFn = this.sinon.stub()

      Parsing.fromFile(parseFn, filePath, sourcePaths)
        .then(() => {
          assert(parseFn.calledOnce)
          assert(parseFn.calledWith(fileContent, filePath, sourcePaths))

          done()
        })
        .catch(done)
    })
  })

  describe('#fromString', () => {
    it('should call the given parse function with the string', function (done) {
      const parseFn = this.sinon.stub()

      Parsing.fromString(parseFn, '123', sourcePaths)
        .then(() => {
          assert(parseFn.calledOnce)
          assert(parseFn.calledWith('123', null, sourcePaths))

          done()
        })
        .catch(done)
    })

    it('should resolve with undefined if the string is empty', function (done) {
      const parseFn = this.sinon.stub()

      Parsing.fromString(parseFn, '', sourcePaths)
        .then(result => {
          assert(parseFn.notCalled)
          assert.equal(typeof result, 'undefined')

          done()
        })
        .catch(done)
    })
  })
})
