/* global describe, it */
const path = require('path')
const assert = require('assert')

const Page = require('../src/page')
const pagesPath = path.resolve(__dirname, 'project', 'src', 'pages')
const state = {
  config: {
    source: {
      pages: pagesPath
    }
  }
}

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
          assert.equal(data.description, 'Our patterns, elements, and components.')
          done()
        })
        .catch(done)
    })

    it('should return page object for grand child page', done => {
      Page.fetchById(state, 'patterns')
        .then(data => {
          assert.equal(data.id, 'patterns')
          assert.equal(data.title, 'Pattern Library')
          done()
        })
        .catch(done)
    })

    it('should infer page title if it is not provided', done => {
      Page.fetchById(state, 'patterns/atoms')
        .then(data => {
          assert.equal(data.title, 'Atoms')
          done()
        })
        .catch(done)
    })

    it('should infer childIds if they are not provided', done => {
      Page.fetchById(state, 'patterns/atoms')
        .then(data => {
          assert.equal(data.childIds.length, 3)
          assert.equal(data.childIds[0], 'patterns/atoms/buttons')
          assert.equal(data.childIds[1], 'patterns/atoms/copytext')
          assert.equal(data.childIds[2], 'patterns/atoms/headlines')
          done()
        })
        .catch(done)
    })

    it('should infer childIds for index if they are not provided', done => {
      Page.fetchById(state, 'index')
        .then(data => {
          assert.equal(data.childIds.length, 2)
          assert.equal(data.childIds[0], 'documentation')
          assert.equal(data.childIds[1], 'patterns')
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
          assert.equal(data.path, 'pattern-library')
          done()
        })
        .catch(done)
    })

    it('should render content from markdown', done => {
      Page.fetchById(state, 'index')
        .then(data => {
          assert.equal(data.content, '<p>Welcome!</p>')
          done()
        })
        .catch(done)
    })

    it('should register files that do not start with an underscore', done => {
      Page.fetchById(state, 'patterns')
        .then(data => {
          assert.equal(data.files.length, 2)
          assert.equal(data.files[0], path.join(pagesPath, 'patterns', 'patterns-file.txt'))
          assert.equal(data.files[1], path.join(pagesPath, 'patterns', 'some-files', 'file-in-folder.txt'))
          done()
        })
        .catch(done)
    })

    it('should register files in folders that do not start with an underscore', done => {
      Page.fetchById(state, 'index')
        .then(data => {
          assert.equal(data.files.length, 2)
          assert.equal(data.files[0], path.join(pagesPath, 'extra-files', 'file-in-folder.txt'))
          assert.equal(data.files[1], path.join(pagesPath, 'index.txt'))
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
  })

  describe('#fetchAll', () => {
    it('should return pages object', done => {
      Page.fetchAll(state)
        .then(data => {
          const pageIds = Object.keys(data)

          assert.equal(pageIds.length, 11)
          assert(pageIds.includes('index'), 'missing page "index"')
          assert(pageIds.includes('documentation'), 'missing page "documentation"')
          assert(pageIds.includes('patterns'), 'missing page "patterns"')
          assert(pageIds.includes('patterns/atoms'), 'missing page "patterns/atoms"')
          assert(pageIds.includes('patterns/atoms/buttons'), 'missing page "patterns/atoms/buttons"')
          done()
        })
        .catch(done)
    })

    it('should return empty object if pages source is not set', done => {
      Page.fetchAll({ config: { source: { } } })
        .then(data => {
          const pageIds = Object.keys(data)

          assert.equal(pageIds.length, 0)
          done()
        })
        .catch(done)
    })
  })
})
