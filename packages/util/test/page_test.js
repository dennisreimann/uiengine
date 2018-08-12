const assert = require('assert')
const { join, resolve } = require('path')

const PageUtil = require('../src/page')

const { testProjectPath } = require('../../../test/support/paths')
const pagesPath = resolve(testProjectPath, 'src', 'uiengine', 'pages')

describe('PageUtil', () => {
  describe('#pageIdToPath', () => {
    it('should return empty path for index page', () => {
      assert.strictEqual(PageUtil.pageIdToPath('index'), '')
    })

    it('should return path for page', () => {
      assert.strictEqual(PageUtil.pageIdToPath('patterns/atoms/buttons'), 'patterns/atoms/buttons')
    })
  })

  describe('#pageIdToTitle', () => {
    it('should return titleized name', () => {
      assert.strictEqual(PageUtil.pageIdToTitle('index'), 'Home')
      assert.strictEqual(PageUtil.pageIdToTitle('patterns/atoms'), 'Atoms')
      assert.strictEqual(PageUtil.pageIdToTitle('pattern-library'), 'Pattern Library')
    })
  })

  describe('#pageIdToFilePath', () => {
    it('should return page file path for index page', () => {
      assert.strictEqual(
        PageUtil.pageIdToFilePath(pagesPath, 'index'),
        join(pagesPath, 'page.md')
      )
    })

    it('should return page file path for page', () => {
      assert.strictEqual(
        PageUtil.pageIdToFilePath(pagesPath, 'patterns/atoms/buttons'),
        join(pagesPath, 'patterns', 'atoms', 'buttons', 'page.md')
      )
    })
  })

  describe('#pageFilePathToId', () => {
    it('should return page id for index file path', () => {
      assert.strictEqual(PageUtil.pageFilePathToId(pagesPath, join(pagesPath, 'page.md')), 'index')
    })

    it('should return page id for page file path', () => {
      assert.strictEqual(PageUtil.pageFilePathToId(pagesPath, join(pagesPath, 'patterns', 'atoms', 'copytext', 'page.md')), 'patterns/atoms/copytext')
    })

    it('should return page id for file path', () => {
      assert.strictEqual(PageUtil.pageFilePathToId(pagesPath, join(pagesPath, 'testcases', 'index.txt')), 'testcases')
    })

    it('should return page id for nested file path', () => {
      assert.strictEqual(PageUtil.pageFilePathToId(pagesPath, join(pagesPath, 'static', 'additional.pdf')), 'index')
    })

    it('should return page id for nested file path without direct parent', () => {
      assert.strictEqual(PageUtil.pageFilePathToId(pagesPath, join(pagesPath, 'static', 'test', 'nested', 'additional.pdf')), 'index')
    })

    it('should return null for invalid file path', () => {
      const filePath = resolve(testProjectPath, 'src', 'components', 'component.md')
      assert.strictEqual(PageUtil.pageFilePathToId(pagesPath, filePath), null)
    })
  })

  describe('#parentIdForPageId', () => {
    it('should return null for index page id', () => {
      const pageIds = ['index']
      assert.strictEqual(PageUtil.parentIdForPageId(pageIds, 'index'), null)
    })

    it('should return parent page id for page id', () => {
      const pageIds = ['index', 'patterns', 'patterns/atoms', 'patterns/atoms/buttons']
      assert.strictEqual(PageUtil.parentIdForPageId(pageIds, 'patterns/atoms/buttons'), 'patterns/atoms')
    })

    it('should return next parent page id for page id with no intermediate parent', () => {
      const pageIds = ['index', 'patterns/atoms/buttons']
      assert.strictEqual(PageUtil.parentIdForPageId(pageIds, 'patterns/atoms/buttons'), 'index')
    })
  })

  describe('#pageIdForComponentId', () => {
    it('should convert the component id into a page id based on the parent page id for index page', () => {
      const pageId = PageUtil.pageIdForComponentId('index', 'button')
      assert.strictEqual(pageId, 'button')
    })

    it('should convert the component id into a page id based on the parent page id for child page', () => {
      const pageId = PageUtil.pageIdForComponentId('patterns/atoms', 'button')
      assert.strictEqual(pageId, 'patterns/atoms/button')
    })
  })

  describe('#pagePathForComponentId', () => {
    it('should convert the component id into a page path based on the parent page path for index page', () => {
      const pagePath = PageUtil.pagePathForComponentId('', 'button')
      assert.strictEqual(pagePath, 'button')
    })

    it('should convert the component id into a page path based on the parent page path for child page', () => {
      const pagePath = PageUtil.pagePathForComponentId('patterns/atoms', 'button')
      assert.strictEqual(pagePath, 'patterns/atoms/button')
    })
  })

  describe('#convertUserProvidedChildrenList', () => {
    it('should convert the children list provided by the user to childIds for index page', () => {
      const availableChildIds = ['docs', 'patterns']
      const attrs = { children: availableChildIds.reverse() }
      const { childIds } = PageUtil.convertUserProvidedChildrenList('index', availableChildIds, attrs)
      assert.strictEqual(childIds[0], 'patterns')
      assert.strictEqual(childIds[1], 'docs')
    })

    it('should convert a prefixed children list provided by the user to childIds for child page', () => {
      const availableChildIds = ['patterns/atoms', 'patterns/molecules']
      const attrs = { children: availableChildIds }
      const { childIds } = PageUtil.convertUserProvidedChildrenList('patterns', availableChildIds, attrs)
      assert.strictEqual(childIds[0], 'patterns/atoms')
      assert.strictEqual(childIds[1], 'patterns/molecules')
    })

    it('should convert a non-prefixed children list provided by the user to childIds for child page', () => {
      const availableChildIds = ['patterns/atoms', 'patterns/molecules']
      const children = ['atoms', 'molecules']
      const attrs = { children }
      const { childIds } = PageUtil.convertUserProvidedChildrenList('patterns', availableChildIds, attrs)
      assert.strictEqual(childIds[0], 'patterns/atoms')
      assert.strictEqual(childIds[1], 'patterns/molecules')
    })

    it('should return the attributes as they are if the children list is not provided by the user', () => {
      const availableChildIds = ['docs', 'patterns']
      const attrs = { title: 'No children' }
      const converted = PageUtil.convertUserProvidedChildrenList('index', availableChildIds, attrs)
      assert.strictEqual(attrs, converted)
    })

    it('should throw an error if a child does not exist', () => {
      const availableChildIds = ['atoms']
      const attrs = { children: ['atoms', 'doesnotexist'] }

      assert.throws(() => PageUtil.convertUserProvidedChildrenList('patterns', availableChildIds, attrs))
    })
  })

  describe('#convertUserProvidedComponentsList', () => {
    it('should convert the components list provided by the user to componentIds for index page', () => {
      const attrs = { components: ['link', 'button'] }
      const { componentIds } = PageUtil.convertUserProvidedComponentsList('index', attrs)
      assert.strictEqual(componentIds[0], 'link')
      assert.strictEqual(componentIds[1], 'button')
    })

    it('should convert the components list provided by the user to componentIds for child page', () => {
      const attrs = { components: ['link', 'button'] }
      const { componentIds } = PageUtil.convertUserProvidedComponentsList('patterns/atoms', attrs)
      assert.strictEqual(componentIds[0], 'link')
      assert.strictEqual(componentIds[1], 'button')
    })

    it('should return the attributes as they are if the components list is not provided by the user', () => {
      const attrs = { title: 'No components' }
      const converted = PageUtil.convertUserProvidedComponentsList('index', attrs)
      assert.strictEqual(attrs, converted)
    })
  })

  describe('#isDocumentationPage', () => {
    it('should only return true if page type is "documentation"', () => {
      assert(PageUtil.isDocumentationPage('documentation'))
      assert(!PageUtil.isDocumentationPage('template'))
      assert(!PageUtil.isDocumentationPage('tokens'))
    })
  })

  describe('#isTokensPage', () => {
    it('should only return true if page type is "tokens"', () => {
      assert(PageUtil.isTokensPage('tokens'))
      assert(!PageUtil.isTokensPage('template'))
      assert(!PageUtil.isTokensPage('documentation'))
    })
  })

  describe('#determineType', () => {
    it('should return "template" if page attributes has template', () => {
      assert.strictEqual('template', PageUtil.determineType({ template: 'custom.pug' }))
    })

    it('should return "tokens" if page attributes has tokens', () => {
      assert.strictEqual('tokens', PageUtil.determineType({ tokens: {} }))
    })

    it('should return "documentation" if page attributes has neither template nor tokens', () => {
      assert.strictEqual('documentation', PageUtil.determineType({}))
    })
  })
})
