const path = require('path')
const assert = require('assert')
const assertMatches = require('./support/assertMatches')

const Page = require('../src/page')
const { testProjectPath } = require('../../../test/support/paths')
const pagesPath = path.resolve(testProjectPath, 'src', 'uiengine', 'pages')
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
    it('should return page object for index page', done => {
      Page.fetchById(state, 'index')
        .then(data => {
          assert.equal(data.id, 'index')
          assert.equal(data.title, 'Home')
          done()
        })
        .catch(done)
    })

    it('should return page object for child page', done => {
      Page.fetchById(state, 'patterns')
        .then(data => {
          assert.equal(data.id, 'patterns')
          assert.equal(data.title, 'Pattern Library')
          done()
        })
        .catch(done)
    })

    it('should return page object for grand child page', done => {
      Page.fetchById(state, 'testcases/custom-data')
        .then(data => {
          assert.equal(data.id, 'testcases/custom-data')
          assert.equal(data.title, 'Custom Data')
          assert.equal(data.description, 'This is some custom page data')
          done()
        })
        .catch(done)
    })

    it('should infer page title from folder name if title in frontmatter is not provided', done => {
      Page.fetchById(state, 'patterns/atoms')
        .then(data => {
          assert.equal(data.title, 'Atoms')
          done()
        })
        .catch(done)
    })

    it('should infer page title from markdown headline if title in frontmatter is not provided', done => {
      Page.fetchById(state, 'testcases')
        .then(data => {
          assert.equal(data.title, 'Test Cases')
          done()
        })
        .catch(done)
    })

    it('should infer childIds if they are not provided', done => {
      Page.fetchById(state, 'testcases')
        .then(data => {
          assert.equal(data.childIds.length, 3)
          assert.equal(data.childIds[0], 'testcases/custom-data')
          assert.equal(data.childIds[1], 'testcases/custom-path')
          assert.equal(data.childIds[2], 'testcases/custom-template')
          done()
        })
        .catch(done)
    })

    it('should infer childIds for index if they are not provided', done => {
      Page.fetchById(state, 'index')
        .then(data => {
          assert.equal(data.childIds.length, 4)
          assert.equal(data.childIds[0], 'documentation')
          assert.equal(data.childIds[1], 'patterns')
          assert.equal(data.childIds[2], 'testcases')
          assert.equal(data.childIds[3], 'schema')
          done()
        })
        .catch(done)
    })

    it('should not infer childIds if they are explicitely provided', done => {
      Page.fetchById(state, 'patterns')
        .then(data => {
          assert.equal(data.childIds.length, 5)
          assert.equal(data.childIds[0], 'patterns/atoms')
          assert.equal(data.childIds[1], 'patterns/molecules')
          assert.equal(data.childIds[2], 'patterns/organisms')
          assert.equal(data.childIds[3], 'patterns/templates')
          assert.equal(data.childIds[4], 'patterns/pages')
          done()
        })
        .catch(done)
    })

    it('should not infer childIds for index if they are provided', done => {
      const state = {
        config: {
          source: {
            pages: path.resolve(testProjectPath, 'src', 'uiengine', 'docs')
          }
        }
      }

      Page.fetchById(state, 'index')
        .then(data => {
          assert.equal(data.childIds.length, 2)
          assert.equal(data.childIds[0], 'patterns')
          assert.equal(data.childIds[1], 'documentation')
          done()
        })
        .catch(done)
    })

    it('should convert componentIds for user provided component list', done => {
      Page.fetchById(state, 'patterns/atoms')
        .then(data => {
          assert.equal(data.componentIds.length, 2)
          assert.equal(data.componentIds[0], 'label')
          assert.equal(data.componentIds[1], 'input')
          done()
        })
        .catch(done)
    })

    it('should infer path for index if it is not provided', done => {
      Page.fetchById(state, 'index')
        .then(data => {
          assert.equal(data.path, '')
          done()
        })
        .catch(done)
    })

    it('should infer path if it is not provided', done => {
      Page.fetchById(state, 'patterns/atoms')
        .then(data => {
          assert.equal(data.path, 'patterns/atoms')
          done()
        })
        .catch(done)
    })

    it('should not infer path if it is explicitely provided', done => {
      Page.fetchById(state, 'patterns')
        .then(data => {
          assert.equal(data.path, 'patterns')
          done()
        })
        .catch(done)
    })

    it('should render content from markdown', done => {
      Page.fetchById(state, 'index')
        .then(data => {
          assertMatches(data.content, '<p>Welcome! This is the UIengine Sample Project.')
          done()
        })
        .catch(done)
    })

    it('should register files that do not start with an underscore', done => {
      Page.fetchById(state, 'testcases')
        .then(data => {
          assert.equal(data.files.length, 2)
          assert.equal(data.files[0], path.join(pagesPath, 'testcases', 'extra-files', 'file-in-folder.txt'))
          assert.equal(data.files[1], path.join(pagesPath, 'testcases', 'index.txt'))
          done()
        })
        .catch(done)
    })

    it('should register files in folders that do not start with an underscore', done => {
      Page.fetchById(state, 'testcases')
        .then(data => {
          assert.equal(data.files.length, 2)
          assert.equal(data.files[0], path.join(pagesPath, 'testcases', 'extra-files', 'file-in-folder.txt'))
          assert.equal(data.files[1], path.join(pagesPath, 'testcases', 'index.txt'))
          done()
        })
        .catch(done)
    })

    it('should register empty array if no files are present', done => {
      Page.fetchById(state, 'patterns/atoms')
        .then(data => {
          assert.equal(data.files.length, 0)
          done()
        })
        .catch(done)
    })

    it('should determine page type documentation for standard pages', done => {
      Page.fetchById(state, 'index')
        .then(data => {
          assert.equal(data.type, 'documentation')
          done()
        })
        .catch(done)
    })

    it('should determine page type template for pages with custom template', done => {
      Page.fetchById(state, 'testcases/custom-template')
        .then(data => {
          assert.equal(data.type, 'template')
          assert.equal(data.template, 'page')
          done()
        })
        .catch(done)
    })

    it('should determine page type tokens for pages with tokens attribute', done => {
      Page.fetchById(state, 'documentation/tokens/spaces')
        .then(data => {
          assert.equal(data.type, 'tokens')
          done()
        })
        .catch(done)
    })
  })

  describe('#fetchAll', () => {
    it('should return pages object', function (done) {
      this.timeout(10000)

      Page.fetchAll(state)
        .then(data => {
          const pageIds = Object.keys(data)

          assert.equal(pageIds.length, 20)

          assertPage(pageIds, 'index')
          assertPage(pageIds, 'documentation')
          assertPage(pageIds, 'documentation/development')
          assertPage(pageIds, 'documentation/getting-started')
          assertPage(pageIds, 'patterns')
          assertPage(pageIds, 'patterns/atoms')
          assertPage(pageIds, 'patterns/molecules')
          assertPage(pageIds, 'patterns/organisms')
          assertPage(pageIds, 'patterns/templates')
          assertPage(pageIds, 'patterns/pages')
          assertPage(pageIds, 'schema')

          done()
        })
        .catch(done)
    })

    it('should return only schema page if pages source is not set', done => {
      Page.fetchAll({ config: { source: { } } })
        .then(data => {
          const pageIds = Object.keys(data)

          assert.equal(pageIds.length, 1)
          assert.equal(pageIds[0], 'schema')

          done()
        })
        .catch(done)
    })
  })
})
