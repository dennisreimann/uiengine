/* global describe, it */
const assert = require('assert')
const fs = require('fs')

const File = require('../lib/util/file')

describe('File', () => {
  describe('#read', () => {
    it('should return file content', done => {
      File.read('./test/fixtures/markdown.md')
        .then(data => {
          assert.equal(data, '# Homepage\n\nWelcome!\n')
          done()
        })
        .catch(done)
    })
  })

  describe('#write', () => {
    it('should write content to file', done => {
      const filePath = './test/tmpWriteFileTest.txt'
      File.write(filePath, 'Test')
        .then(() => {
          const content = fs.readFileSync(filePath)
          assert.equal(content, 'Test')
          fs.unlinkSync(filePath)
          done()
        })
        .catch(done)
    })
  })
})
