const assert = require('assert')
const assertExists = require('../../../test/support/assertExists')
const { readFileSync, removeSync } = require('fs-extra')
const { join } = require('path')

const File = require('../src/util/file')
const { testTmpPath } = require('../../../test/support/paths')

describe('File', () => {
  describe('#extension', () => {
    it('should return file extension', () => {
      const ext = File.extension(join(__dirname, 'fixtures/markdown.md'))

      assert.equal(ext, 'md')
    })
  })

  describe('#read', () => {
    it('should return file content', done => {
      File.read(join(__dirname, 'fixtures/markdown.md'))
        .then(data => {
          assert.equal(data, '# Homepage\n\nWelcome!')
          done()
        })
        .catch(done)
    })

    it('should throw error in case the file does not exist', done => {
      File.read(join(__dirname, 'does-not-exist.txt'))
        .catch(error => {
          assert(error)
          done()
        })
    })
  })

  describe('#write', () => {
    it('should write content to file', done => {
      const filePath = join(testTmpPath, 'writeFileTest.txt')
      File.write(filePath, 'Test')
        .then(() => {
          const content = readFileSync(filePath, 'utf8')
          assert.equal(content, 'Test')

          removeSync(filePath)
          done()
        })
        .catch(done)
    })
  })

  describe('#copy', () => {
    it('should copy file from source to destination', done => {
      const src = join(__dirname, 'fixtures/frontmatter.txt')
      const dst = join(testTmpPath, 'frontmatter.txt')
      File.copy(src, dst)
        .then(() => {
          assertExists(dst)

          removeSync(dst)
          done()
        })
        .catch(done)
    })

    it('should copy directory from source to destination', done => {
      const src = join(__dirname, 'fixtures')
      const dst = join(testTmpPath, 'fixtures')
      File.copy(src, dst)
        .then(() => {
          assertExists(join(dst, 'yaml.yml'))

          removeSync(dst)
          done()
        })
        .catch(done)
    })
  })
})
