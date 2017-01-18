/* global describe, it */
const assert = require('assert')

const Page = require('../lib/page')
const state = {
  config: {
    basedirs: {
      pages: './test/project/pages'
    }
  }
}

describe('Page', () => {
  describe('#fetchByPageId', () => {
    it('should return page object for index page', done => {
      Page.fetchByPageId(state, 'index')
        .then(data => {
          assert.equal(data.id, 'index')
          assert.equal(data.title, 'Index')
          done()
        })
        .catch(done)
    })

    it('should return page object for child page', done => {
      Page.fetchByPageId(state, 'child1')
        .then(data => {
          assert.equal(data.id, 'child1')
          assert.equal(data.title, 'Child 1')
          done()
        })
        .catch(done)
    })

    it('should return page object for grand child page', done => {
      Page.fetchByPageId(state, 'child1/grandchild1')
        .then(data => {
          assert.equal(data.id, 'child1/grandchild1')
          assert.equal(data.title, 'Grandchild 1')
          done()
        })
        .catch(done)
    })

    it('should infer children if they are not provided', done => {
      Page.fetchByPageId(state, 'child1')
        .then(data => {
          assert.equal(data.children.length, 1)
          assert.equal(data.children[0], 'child1/grandchild1')
          done()
        })
        .catch(done)
    })

    it('should not infer children if they are explicitely provided', done => {
      Page.fetchByPageId(state, 'child2')
        .then(data => {
          assert.equal(data.children.length, 1)
          assert.equal(data.children[0], 'child2/grandchild2')
          done()
        })
        .catch(done)
    })

    it('should infer path if it is not provided', done => {
      Page.fetchByPageId(state, 'child2/grandchild2')
        .then(data => {
          assert.equal(data.path, 'child2/grandchild2')
          done()
        })
        .catch(done)
    })

    it('should not infer path if it is explicitely provided', done => {
      Page.fetchByPageId(state, 'child1')
        .then(data => {
          assert.equal(data.path, 'childpage/path/explicit')
          done()
        })
        .catch(done)
    })

    it('should render content from markdown', done => {
      Page.fetchByPageId(state, 'index')
        .then(data => {
          assert.equal(data.content, '<h1>Homepage</h1>\n<p>Welcome!</p>\n')
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

          assert.equal(pageIds.length, 6)
          assert(pageIds.includes('index'), 'missing page "index"')
          assert(pageIds.includes('child1'), 'missing page "child1"')
          assert(pageIds.includes('child2'), 'missing page "child2"')
          done()
        })
        .catch(done)
    })
  })
})
