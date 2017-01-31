/* global describe, it */
const assert = require('assert')

const PageUtil = require('../lib/util/page')

const pagesPath = './pages'

describe('PageUtil', () => {
  describe('#pageIdToPath', () => {
    it('should return empty path for index page', () => {
      assert.equal(PageUtil.pageIdToPath('index'), '')
    })

    it('should return path for page', () => {
      assert.equal(PageUtil.pageIdToPath('patterns/atoms/buttons'), 'patterns/atoms/buttons')
    })
  })

  describe('#pageIdToPageFilePath', () => {
    it('should return page file path for index page', () => {
      assert.equal(PageUtil.pageIdToPageFilePath(pagesPath, 'index'), 'pages/page.md')
    })

    it('should return page file path for page', () => {
      assert.equal(PageUtil.pageIdToPageFilePath(pagesPath, 'patterns/atoms/buttons'), 'pages/patterns/atoms/buttons/page.md')
    })
  })

  describe('#pageFilePathToPageId', () => {
    it('should return page id for index file path', () => {
      assert.equal(PageUtil.pageFilePathToPageId(pagesPath, './pages/page.md'), 'index')
    })

    it('should return page id for page file path', () => {
      assert.equal(PageUtil.pageFilePathToPageId(pagesPath, './pages/patterns/atoms/buttons/page.md'), 'patterns/atoms/buttons')
    })

    it('should return page id for file path', () => {
      assert.equal(PageUtil.pageFilePathToPageId(pagesPath, './pages/patterns/atoms/buttons/additional.pdf'), 'patterns/atoms/buttons')
    })
  })

  describe('#parentIdForPageId', () => {
    it('should return null for index file path', () => {
      assert.equal(PageUtil.parentIdForPageId('index'), null)
    })

    it('should return parent page id for page file path', () => {
      assert.equal(PageUtil.parentIdForPageId('patterns/atoms/buttons'), 'patterns/atoms')
    })
  })

  describe('#parentIdsForPageId', () => {
    it('should return empty array for index file path', () => {
      const parentIds = PageUtil.parentIdsForPageId('index')
      assert.equal(parentIds.length, 0)
    })

    it('should return array with parent page ids for page file path', () => {
      const parentIds = PageUtil.parentIdsForPageId('patterns/atoms/buttons')
      assert.equal(parentIds.length, 3)
      assert.equal(parentIds[0], 'index')
      assert.equal(parentIds[1], 'patterns')
      assert.equal(parentIds[2], 'patterns/atoms')
    })
  })
})
