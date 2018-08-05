const assert = require('assert')
const { assertExists } = require('../../../test/support/asserts')
const { readFileSync, removeSync } = require('fs-extra')
const { join } = require('path')

const FileUtil = require('../src/file')
const { testTmpPath } = require('../../../test/support/paths')

describe('FileUtil', () => {
  describe('#exists', () => {
    it('should return true for existing files', () => {
      assert.strictEqual(true, FileUtil.exists(join(__dirname, 'fixtures/markdown.md')))
    })

    it('should return false for non-existing files', () => {
      assert.strictEqual(false, FileUtil.exists(join(__dirname, 'fixtures/does-not-exist.md')))
    })

    it('should return true for directories', () => {
      assert.strictEqual(true, FileUtil.exists(join(__dirname, 'fixtures')))
    })
  })

  describe('#isDirectory', () => {
    it('should return true for directories', () => {
      assert.strictEqual(true, FileUtil.isDirectory(join(__dirname, 'fixtures')))
    })

    it('should return false for files', () => {
      assert.strictEqual(false, FileUtil.isDirectory(join(__dirname, 'fixtures/markdown.md')))
    })
  })

  describe('#exists', () => {
    it('should return true for existing files', () => {
      assert.strictEqual(true, FileUtil.exists(join(__dirname, 'fixtures/markdown.md')))
    })

    it('should return false for non-existing files', () => {
      assert.strictEqual(false, FileUtil.exists(join(__dirname, 'fixtures/does-not-exist.md')))
    })
  })

  describe('#extension', () => {
    it('should return file extension', () => {
      const ext = FileUtil.extension(join(__dirname, 'fixtures/markdown.md'))

      assert.strictEqual(ext, 'md')
    })
  })

  describe('#read', () => {
    it('should return file content', async () => {
      const data = await FileUtil.read(join(__dirname, 'fixtures/markdown.md'))

      assert.strictEqual(data, '# Homepage\n\nWelcome!')
    })

    it('should throw error in case the file does not exist', async () => {
      try {
        await FileUtil.read(join(__dirname, 'does-not-exist.txt'))
      } catch (error) {
        assert(error)
      }
    })
  })

  describe('#write', () => {
    it('should write content to file', async () => {
      const filePath = join(testTmpPath, 'writeFileUtilTest.txt')
      await FileUtil.write(filePath, 'Test')
      const content = readFileSync(filePath, 'utf8')

      assert.strictEqual(content, 'Test')
      removeSync(filePath)
    })
  })

  describe('#copy', () => {
    it('should copy file from source to destination', async () => {
      const src = join(__dirname, 'fixtures/frontmatter.txt')
      const dst = join(testTmpPath, 'frontmatter.txt')
      await FileUtil.copy(src, dst)

      assertExists(dst)
      removeSync(dst)
    })

    it('should copy directory from source to destination', async () => {
      const src = join(__dirname, 'fixtures')
      const dst = join(testTmpPath, 'fixtures')
      await FileUtil.copy(src, dst)

      assertExists(join(dst, 'yaml.yml'))
      removeSync(dst)
    })
  })
})
