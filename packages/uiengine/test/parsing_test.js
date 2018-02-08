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
    it('should call the given parse function with the file content', async function () {
      const parseFn = this.sinon.stub()
      await Parsing.fromFile(parseFn, filePath, sourcePaths)

      assert(parseFn.calledOnce)
      assert(parseFn.calledWith(fileContent, filePath, sourcePaths))
    })
  })

  describe('#fromString', () => {
    it('should call the given parse function with the string', async function () {
      const parseFn = this.sinon.stub()
      await Parsing.fromString(parseFn, '123', sourcePaths)

      assert(parseFn.calledOnce)
      assert(parseFn.calledWith('123', null, sourcePaths))
    })

    it('should resolve with undefined if the string is empty', async function () {
      const parseFn = this.sinon.stub()
      const result = await Parsing.fromString(parseFn, '', sourcePaths)

      assert(parseFn.notCalled)
      assert.equal(typeof result, 'undefined')
    })
  })
})
