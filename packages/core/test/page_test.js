const assert = require('assert')
const { assertMatches } = require('../../../test/support/asserts')
const { join, resolve } = require('path')

const Page = require('../src/page')
const { testProjectPath } = require('../../../test/support/paths')
const pagesPath = resolve(testProjectPath, 'src', 'uiengine', 'pages')
const state = {
  config: {
    source: {
      base: testProjectPath,
      pages: pagesPath
    }
  }
}

const assertItem = (items, item) => assert(items.includes(item), `missing "${item}"`)

describe('Page', () => {
  describe('#fetchById', () => {
    it('should return page object for index page', async () => {
      const data = await Page.fetchById(state, 'index')

      assert.equal(data.id, 'index')
      assert.equal(data.title, 'Home')
    })

    it('should return page object for child page', async () => {
      const data = await Page.fetchById(state, 'patterns')

      assert.equal(data.id, 'patterns')
      assert.equal(data.title, 'Pattern Library')
    })

    it('should return page object for grand child page', async () => {
      const data = await Page.fetchById(state, 'testcases/custom-data')

      assert.equal(data.id, 'testcases/custom-data')
      assert.equal(data.title, 'Custom Data')
      assert.equal(data.description, 'This is some custom page data')
    })

    it('should resolve title from content heading if there is no title in attributes', async () => {
      const data = await Page.fetchById(state, 'testcases')

      assert.equal(data.title, 'Test Cases')
    })

    it('should resolve title from component id if there is no title in attributes or content', async () => {
      const data = await Page.fetchById(state, 'patterns/atoms')

      assert.equal(data.title, 'Atoms')
    })

    it('should infer childIds if they are not provided', async () => {
      const data = await Page.fetchById(state, 'testcases')

      assert.equal(data.childIds.length, 3)
      assertItem(data.childIds, 'testcases/custom-data')
      assertItem(data.childIds, 'testcases/custom-path')
      assertItem(data.childIds, 'testcases/custom-template')
    })

    it('should infer childIds for index if they are not provided', async () => {
      const data = await Page.fetchById(state, 'index')

      assert.equal(data.childIds.length, 4)
      assertItem(data.childIds, 'documentation')
      assertItem(data.childIds, 'patterns')
      assertItem(data.childIds, 'testcases')
      assertItem(data.childIds, 'entities')
    })

    it('should not infer childIds if they are explicitely provided', async () => {
      const data = await Page.fetchById(state, 'patterns')

      assert.equal(data.childIds.length, 5)
      assertItem(data.childIds, 'patterns/atoms')
      assertItem(data.childIds, 'patterns/molecules')
      assertItem(data.childIds, 'patterns/organisms')
      assertItem(data.childIds, 'patterns/templates')
      assertItem(data.childIds, 'patterns/pages')
    })

    it('should not infer childIds for index if they are provided', async () => {
      const state = {
        config: {
          source: {
            pages: resolve(testProjectPath, 'src', 'uiengine', 'docs')
          }
        }
      }
      const data = await Page.fetchById(state, 'index')

      assert.equal(data.childIds.length, 2)
      assertItem(data.childIds, 'patterns')
      assertItem(data.childIds, 'documentation')
    })

    it('should convert componentIds for user provided component list', async () => {
      const data = await Page.fetchById(state, 'patterns/atoms')

      assert.equal(data.componentIds.length, 2)
      assertItem(data.componentIds, 'label')
      assertItem(data.componentIds, 'input')
    })

    it('should convert childIds for user provided children list', async () => {
      const data = await Page.fetchById(state, 'documentation')

      assert.equal(data.childIds.length, 3)
      assertItem(data.childIds, 'documentation/getting-started')
      assertItem(data.childIds, 'documentation/development')
      assertItem(data.childIds, 'documentation/tokens')
    })

    it('should infer path for index if it is not provided', async () => {
      const data = await Page.fetchById(state, 'index')

      assert.equal(data.path, '')
    })

    it('should infer path if it is not provided', async () => {
      const data = await Page.fetchById(state, 'patterns/atoms')

      assert.equal(data.path, 'patterns/atoms')
    })

    it('should not infer path if it is explicitely provided', async () => {
      const data = await Page.fetchById(state, 'patterns')
      assert.equal(data.path, 'patterns')
    })

    it('should render content from markdown', async () => {
      const data = await Page.fetchById(state, 'index')

      assertMatches(data.content, '<p>Welcome! This is the UIengine Sample Project.')
    })

    it('should register files that do not start with an underscore', async () => {
      const data = await Page.fetchById(state, 'testcases')

      assert.equal(data.files.length, 3)
      assertItem(data.files, join(pagesPath, 'testcases', 'extra-files', 'file-in-folder.txt'))
      assertItem(data.files, join(pagesPath, 'testcases', 'extra-files', 'subfolder', 'file-in-subfolder.txt'))
      assertItem(data.files, join(pagesPath, 'testcases', 'index.txt'))
    })

    it('should register files in folders that do not start with an underscore', async () => {
      const data = await Page.fetchById(state, 'testcases')

      assert.equal(data.files.length, 3)
      assertItem(data.files, join(pagesPath, 'testcases', 'extra-files', 'file-in-folder.txt'))
      assertItem(data.files, join(pagesPath, 'testcases', 'extra-files', 'subfolder', 'file-in-subfolder.txt'))
      assertItem(data.files, join(pagesPath, 'testcases', 'index.txt'))
    })

    it('should have no files property if no files are present', async () => {
      const data = await Page.fetchById(state, 'patterns/atoms')

      assert.equal(data.files, undefined)
    })

    it('should determine page type documentation for standard pages', async () => {
      const data = await Page.fetchById(state, 'index')

      assert.equal(data.type, 'documentation')
    })

    it('should determine page type template for pages with custom template', async () => {
      const data = await Page.fetchById(state, 'testcases/custom-template')

      assert.equal(data.type, 'template')
      assert.equal(data.template, 'page.pug')
    })

    it('should determine page type tokens for pages with tokens attribute', async () => {
      const data = await Page.fetchById(state, 'documentation/tokens/spaces')

      assert.equal(data.type, 'tokens')
    })
  })

  describe('#fetchAll', () => {
    it('should return pages object', async () => {
      const data = await Page.fetchAll(state)
      const pageIds = Object.keys(data)

      assert.equal(pageIds.length, 20)

      assertItem(pageIds, 'index')
      assertItem(pageIds, 'documentation')
      assertItem(pageIds, 'documentation/development')
      assertItem(pageIds, 'documentation/getting-started')
      assertItem(pageIds, 'documentation')
      assertItem(pageIds, 'documentation/tokens')
      assertItem(pageIds, 'documentation/tokens/colors')
      assertItem(pageIds, 'documentation/tokens/icons')
      assertItem(pageIds, 'documentation/tokens/spaces')
      assertItem(pageIds, 'documentation/tokens/typography')
      assertItem(pageIds, 'patterns')
      assertItem(pageIds, 'patterns/atoms')
      assertItem(pageIds, 'patterns/molecules')
      assertItem(pageIds, 'patterns/organisms')
      assertItem(pageIds, 'patterns/pages')
      assertItem(pageIds, 'patterns/pages/ajax/layer')
      assertItem(pageIds, 'patterns/templates')
      assertItem(pageIds, 'testcases/custom-data')
      assertItem(pageIds, 'testcases/custom-path')
      assertItem(pageIds, 'testcases/custom-template')
    })
  })

  describe('#fetchEntitiesPage', () => {
    it('should return entities page object', async () => {
      const page = await Page.fetchEntitiesPage(state)

      assertItem(page.id, 'entities')
    })
  })
})
