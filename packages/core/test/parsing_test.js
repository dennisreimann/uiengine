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
  afterEach(function () {
    this.sinon.restore()
  })

  describe('#fromFileSync', () => {
    it('should call the given parse function with the file content', function () {
      const parseFn = this.sinon.stub()

      Parsing.fromFileSync(parseFn, filePath, sourcePaths)

      this.sinon.assert.calledOnce(parseFn)
      this.sinon.assert.calledWith(parseFn, fileContent, filePath, sourcePaths)
    })
  })

  describe('#fromFile', () => {
    it('should call the given parse function with the file content', async function () {
      const parseFn = this.sinon.stub()
      await Parsing.fromFile(parseFn, filePath, sourcePaths)

      this.sinon.assert.calledOnce(parseFn)
      this.sinon.assert.calledWith(parseFn, fileContent, filePath, sourcePaths)
    })
  })

  describe('#fromString', () => {
    it('should call the given parse function with the string', async function () {
      const parseFn = this.sinon.stub()
      await Parsing.fromString(parseFn, '123', sourcePaths)

      this.sinon.assert.calledOnce(parseFn)
      this.sinon.assert.calledWith(parseFn, '123', null, sourcePaths)
    })

    it('should resolve with undefined if the string is empty', async function () {
      const parseFn = this.sinon.stub()
      const result = await Parsing.fromString(parseFn, '', sourcePaths)

      this.sinon.assert.notCalled(parseFn)
      assert.equal(typeof result, 'undefined')
    })
  })
})
