const assert = require('assert')
const assertMatches = require('../../../test/support/assertMatches')
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

const assertPage = (pageIds, pageId) => assert(pageIds.includes(pageId), `missing page "${pageId}"`)

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
      assert.equal(data.childIds[0], 'testcases/custom-data')
      assert.equal(data.childIds[1], 'testcases/custom-path')
      assert.equal(data.childIds[2], 'testcases/custom-template')
    })

    it('should infer childIds for index if they are not provided', async () => {
      const data = await Page.fetchById(state, 'index')

      assert.equal(data.childIds.length, 4)
      assert.equal(data.childIds[0], 'documentation')
      assert.equal(data.childIds[1], 'patterns')
      assert.equal(data.childIds[2], 'testcases')
      assert.equal(data.childIds[3], 'entities')
    })

    it('should not infer childIds if they are explicitely provided', async () => {
      const data = await Page.fetchById(state, 'patterns')

      assert.equal(data.childIds.length, 5)
      assert.equal(data.childIds[0], 'patterns/atoms')
      assert.equal(data.childIds[1], 'patterns/molecules')
      assert.equal(data.childIds[2], 'patterns/organisms')
      assert.equal(data.childIds[3], 'patterns/templates')
      assert.equal(data.childIds[4], 'patterns/pages')
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
      assert.equal(data.childIds[0], 'patterns')
      assert.equal(data.childIds[1], 'documentation')
    })

    it('should convert componentIds for user provided component list', async () => {
      const data = await Page.fetchById(state, 'patterns/atoms')

      assert.equal(data.componentIds.length, 2)
      assert.equal(data.componentIds[0], 'label')
      assert.equal(data.componentIds[1], 'input')
    })

    it('should convert childIds for user provided children list', async () => {
      const data = await Page.fetchById(state, 'documentation')

      assert.equal(data.childIds.length, 3)
      assert.equal(data.childIds[0], 'documentation/getting-started')
      assert.equal(data.childIds[1], 'documentation/development')
      assert.equal(data.childIds[2], 'documentation/tokens')
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

      assert.equal(data.files.length, 2)
      assert.equal(data.files[0], join(pagesPath, 'testcases', 'extra-files', 'file-in-folder.txt'))
      assert.equal(data.files[1], join(pagesPath, 'testcases', 'index.txt'))
    })

    it('should register files in folders that do not start with an underscore', async () => {
      const data = await Page.fetchById(state, 'testcases')

      assert.equal(data.files.length, 2)
      assert.equal(data.files[0], join(pagesPath, 'testcases', 'extra-files', 'file-in-folder.txt'))
      assert.equal(data.files[1], join(pagesPath, 'testcases', 'index.txt'))
    })

    it('should register empty array if no files are present', async () => {
      const data = await Page.fetchById(state, 'patterns/atoms')

      assert.equal(data.files.length, 0)
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

      assertPage(pageIds, 'index')
      assertPage(pageIds, 'documentation')
      assertPage(pageIds, 'documentation/development')
      assertPage(pageIds, 'documentation/getting-started')
      assertPage(pageIds, 'documentation')
      assertPage(pageIds, 'documentation/tokens')
      assertPage(pageIds, 'documentation/tokens/colors')
      assertPage(pageIds, 'documentation/tokens/icons')
      assertPage(pageIds, 'documentation/tokens/spaces')
      assertPage(pageIds, 'documentation/tokens/typography')
      assertPage(pageIds, 'patterns')
      assertPage(pageIds, 'patterns/atoms')
      assertPage(pageIds, 'patterns/molecules')
      assertPage(pageIds, 'patterns/organisms')
      assertPage(pageIds, 'patterns/pages')
      assertPage(pageIds, 'patterns/pages/ajax/layer')
      assertPage(pageIds, 'patterns/templates')
      assertPage(pageIds, 'testcases/custom-data')
      assertPage(pageIds, 'testcases/custom-path')
      assertPage(pageIds, 'testcases/custom-template')
    })
  })

  describe('#fetchEntitiesPage', () => {
    it('should return entities page object', async () => {
      const page = await Page.fetchEntitiesPage(state)

      assertPage(page.id, 'entities')
    })
  })
})
