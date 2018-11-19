require('mocha-sinon')()

const { readFileSync } = require('fs')
const { join, resolve } = require('path')
const assert = require('assert')

const ParsingUtil = require('../src/parsing')

const filePath = resolve(__dirname, 'fixtures', 'markdown.md')
const fileContent = readFileSync(filePath, 'utf8')

const sourcePaths = {
  base: __dirname,
  data: join(__dirname, 'fixtures')
}

describe('ParsingUtil', () => {
  afterEach(function () {
    this.sinon.restore()
  })

  describe('#fromFileSync', () => {
    it('should call the given parse function with the file content', function () {
      const parseFn = this.sinon.stub()

      ParsingUtil.fromFileSync(parseFn, filePath, sourcePaths)

      this.sinon.assert.calledOnce(parseFn)
      this.sinon.assert.calledWith(parseFn, fileContent, filePath, sourcePaths)
    })
  })

  describe('#fromFile', () => {
    it('should call the given parse function with the file content', async function () {
      const parseFn = this.sinon.stub()
      await ParsingUtil.fromFile(parseFn, filePath, sourcePaths)

      this.sinon.assert.calledOnce(parseFn)
      this.sinon.assert.calledWith(parseFn, fileContent, filePath, sourcePaths)
    })
  })

  describe('#fromString', () => {
    it('should call the given parse function with the string', async function () {
      const parseFn = this.sinon.stub()
      await ParsingUtil.fromString(parseFn, '123', sourcePaths)

      this.sinon.assert.calledOnce(parseFn)
      this.sinon.assert.calledWith(parseFn, '123', null, sourcePaths)
    })

    it('should resolve with undefined if the string is empty', async function () {
      const parseFn = this.sinon.stub()
      const result = await ParsingUtil.fromString(parseFn, '', sourcePaths)

      this.sinon.assert.notCalled(parseFn)
      assert.strictEqual(typeof result, 'undefined')
    })
  })
})
