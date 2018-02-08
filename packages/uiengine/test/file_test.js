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
    it('should return file content', async () => {
      const data = await File.read(join(__dirname, 'fixtures/markdown.md'))

      assert.equal(data, '# Homepage\n\nWelcome!')
    })

    it('should throw error in case the file does not exist', async () => {
      try {
        await File.read(join(__dirname, 'does-not-exist.txt'))
      } catch (error) {
        assert(error)
      }
    })
  })

  describe('#write', () => {
    it('should write content to file', async () => {
      const filePath = join(testTmpPath, 'writeFileTest.txt')
      await File.write(filePath, 'Test')
      const content = readFileSync(filePath, 'utf8')

      assert.equal(content, 'Test')
      removeSync(filePath)
    })
  })

  describe('#copy', () => {
    it('should copy file from source to destination', async () => {
      const src = join(__dirname, 'fixtures/frontmatter.txt')
      const dst = join(testTmpPath, 'frontmatter.txt')
      await File.copy(src, dst)

      assertExists(dst)
      removeSync(dst)
    })

    it('should copy directory from source to destination', async () => {
      const src = join(__dirname, 'fixtures')
      const dst = join(testTmpPath, 'fixtures')
      await File.copy(src, dst)

      assertExists(join(dst, 'yaml.yml'))
      removeSync(dst)
    })
  })
})
