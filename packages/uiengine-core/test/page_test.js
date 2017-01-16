/* global describe, it */
const assert = require('assert')

const Page = require('../lib/entities/page')
const state = {
  config: {
    basedirs: {
      pages: './test/project/pages'
    }
  }
}

describe('Page', () => {
  describe('#fetchByPageId', () => {
    it('should return page object for index page', (done) => {
      Page.fetchByPageId(state, 'index')
        .then(data => {
          assert.equal(data.id, 'index')
          assert.equal(data.name, 'Index')
          done()
        })
        .catch(done)
    })

    it('should return page object for child page', (done) => {
      Page.fetchByPageId(state, 'child1')
        .then(data => {
          assert.equal(data.id, 'child1')
          assert.equal(data.name, 'Child 1')
          done()
        })
        .catch(done)
    })

    it('should return page object for grand child page', (done) => {
      Page.fetchByPageId(state, 'child1/grandchild1')
        .then(data => {
          assert.equal(data.id, 'child1/grandchild1')
          assert.equal(data.name, 'Grandchild 1')
          done()
        })
        .catch(done)
    })

    it('should infer children if they are not provided', (done) => {
      Page.fetchByPageId(state, 'child1')
        .then(data => {
          assert.equal(data.children.length, 1)
          assert.equal(data.children[0], 'child1/grandchild1')
          done()
        })
        .catch(done)
    })

    it('should not infer children if they are explicitely provided', (done) => {
      Page.fetchByPageId(state, 'child2')
        .then(data => {
          assert.equal(data.children.length, 1)
          assert.equal(data.children[0], 'child2/grandchild2')
          done()
        })
        .catch(done)
    })
  })

  describe('#fetchAll', () => {
    it('should return pages list', (done) => {
      Page.fetchAll(state)
        .then(data => {
          assert.equal(data.length, 6)
          done()
        })
        .catch(done)
    })
  })
})
