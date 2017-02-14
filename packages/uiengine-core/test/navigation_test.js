/* global describe, it */
const assert = require('assert')
const Factory = require('./support/factory')

const Navigation = require('../src/navigation')

describe('Navigation', () => {
  describe('#forPages', () => {
    it('should generate site navigation', done => {
      const state = {
        pages: {
          'index': Factory.page('index', { childIds: ['child1', 'child2'] }),
          'child1': Factory.page('child1', { childIds: ['child1/grandchild1', 'child1/grandchild2'] }),
          'child2': Factory.page('child2', { childIds: ['child2/grandchild1'] }),
          'child1/grandchild1': Factory.page('child1/grandchild1', { childIds: ['child1/grandchild1/greatgrandchild1'] }),
          'child1/grandchild2': Factory.page('child1/grandchild2'),
          'child1/grandchild1/greatgrandchild1': Factory.page('child1/grandchild1/greatgrandchild1')
        }
      }

      Navigation.forPages(state, 'index')
        .then(data => {
          assert.equal(Object.keys(data).length, 6)

          assert(data['index'])
          assert(data['child1'])
          assert(data['child2'])
          assert(data['child1/grandchild1'])
          assert(data['child1/grandchild2'])
          assert(data['child1/grandchild1/greatgrandchild1'])

          const index = data['index']
          assert.equal(index.id, 'index')
          assert.equal(index.childIds.length, 2)
          assert.equal(index.childIds[0], 'child1')
          assert.equal(index.childIds[1], 'child2')
          assert.equal(index.parentId, null)
          assert.equal(index.parentIds.length, 0)
          assert.equal(index.siblingBeforeId, null)
          assert.equal(index.siblingsBeforeIds.length, 0)
          assert.equal(index.siblingsAfterIds.length, 0)
          assert.equal(index.siblingAfterId, null)

          const child1 = data['child1']
          assert.equal(child1.id, 'child1')
          assert.equal(child1.childIds.length, 2)
          assert.equal(child1.childIds[0], 'child1/grandchild1')
          assert.equal(child1.childIds[1], 'child1/grandchild2')
          assert.equal(child1.parentId, 'index')
          assert.equal(child1.parentIds.length, 1)
          assert.equal(child1.parentIds[0], 'index')
          assert.equal(child1.siblingBeforeId, null)
          assert.equal(child1.siblingsBeforeIds.length, 0)
          assert.equal(child1.siblingsAfterIds.length, 1)
          assert.equal(child1.siblingsAfterIds[0], 'child2')
          assert.equal(child1.siblingAfterId, 'child2')

          const child2 = data['child2']
          assert.equal(child2.id, 'child2')
          assert.equal(child2.childIds.length, 1)
          assert.equal(child2.childIds[0], 'child2/grandchild1')
          assert.equal(child2.parentId, 'index')
          assert.equal(child2.parentIds.length, 1)
          assert.equal(child2.parentIds[0], 'index')
          assert.equal(child2.siblingBeforeId, 'child1')
          assert.equal(child2.siblingsBeforeIds.length, 1)
          assert.equal(child2.siblingsBeforeIds[0], 'child1')
          assert.equal(child2.siblingsAfterIds.length, 0)
          assert.equal(child2.siblingAfterId, null)

          const child1grandchild1 = data['child1/grandchild1']
          assert.equal(child1grandchild1.id, 'child1/grandchild1')
          assert.equal(child1grandchild1.childIds.length, 1)
          assert.equal(child1grandchild1.childIds[0], 'child1/grandchild1/greatgrandchild1')
          assert.equal(child1grandchild1.parentId, 'child1')
          assert.equal(child1grandchild1.parentIds.length, 2)
          assert.equal(child1grandchild1.parentIds[0], 'index')
          assert.equal(child1grandchild1.parentIds[1], 'child1')
          assert.equal(child1grandchild1.siblingBeforeId, null)
          assert.equal(child1grandchild1.siblingsBeforeIds.length, 0)
          assert.equal(child1grandchild1.siblingsAfterIds.length, 1)
          assert.equal(child1grandchild1.siblingsAfterIds[0], 'child1/grandchild2')
          assert.equal(child1grandchild1.siblingAfterId, 'child1/grandchild2')

          const child1grandchild2 = data['child1/grandchild2']
          assert.equal(child1grandchild2.id, 'child1/grandchild2')
          assert.equal(child1grandchild2.childIds.length, 0)
          assert.equal(child1grandchild2.parentId, 'child1')
          assert.equal(child1grandchild2.parentIds.length, 2)
          assert.equal(child1grandchild2.parentIds[0], 'index')
          assert.equal(child1grandchild2.parentIds[1], 'child1')
          assert.equal(child1grandchild2.siblingBeforeId, 'child1/grandchild1')
          assert.equal(child1grandchild2.siblingsBeforeIds.length, 1)
          assert.equal(child1grandchild2.siblingsBeforeIds[0], 'child1/grandchild1')
          assert.equal(child1grandchild2.siblingsAfterIds.length, 0)
          assert.equal(child1grandchild2.siblingAfterId, null)

          const child2grandchild1greatgrandchild1 = data['child1/grandchild1/greatgrandchild1']
          assert.equal(child2grandchild1greatgrandchild1.id, 'child1/grandchild1/greatgrandchild1')
          assert.equal(child2grandchild1greatgrandchild1.childIds.length, 0)
          assert.equal(child2grandchild1greatgrandchild1.parentId, 'child1/grandchild1')
          assert.equal(child2grandchild1greatgrandchild1.parentIds.length, 3)
          assert.equal(child2grandchild1greatgrandchild1.parentIds[0], 'index')
          assert.equal(child2grandchild1greatgrandchild1.parentIds[1], 'child1')
          assert.equal(child2grandchild1greatgrandchild1.parentIds[2], 'child1/grandchild1')
          assert.equal(child2grandchild1greatgrandchild1.siblingBeforeId, null)
          assert.equal(child2grandchild1greatgrandchild1.siblingsBeforeIds.length, 0)
          assert.equal(child2grandchild1greatgrandchild1.siblingsAfterIds.length, 0)
          assert.equal(child2grandchild1greatgrandchild1.siblingAfterId, null)

          done()
        })
        .catch(done)
    })
  })

  describe('#forPageId', () => {
    it('should generate page navigation', done => {
      const state = {
        pages: {
          'index': Factory.page('index', { childIds: ['child1'] }),
          'child1': Factory.page('child1', { childIds: ['child1/grandchild1'] }),
          'child1/grandchild1': Factory.page('child1/grandchild1', { childIds: ['child1/grandchild1/greatgrandchild1'] }),
          'child1/grandchild1/greatgrandchild1': Factory.page('child1/grandchild1/greatgrandchild1')
        }
      }

      Navigation.forPageId(state, 'child1/grandchild1')
        .then(pageNav => {
          assert.equal(pageNav.id, 'child1/grandchild1')
          assert.equal(pageNav.childIds.length, 1)
          assert.equal(pageNav.childIds[0], 'child1/grandchild1/greatgrandchild1')
          assert.equal(pageNav.parentId, 'child1')
          assert.equal(pageNav.parentIds.length, 2)
          assert.equal(pageNav.parentIds[0], 'index')
          assert.equal(pageNav.parentIds[1], 'child1')
          assert.equal(pageNav.siblingsBeforeIds.length, 0)
          assert.equal(pageNav.siblingsAfterIds.length, 0)

          done()
        })
        .catch(done)
    })

    it('should throw error if page does not exist', done => {
      const state = { pages: {} }
      Navigation.forPageId(state, 'index')
        .catch(error => {
          assert(error)
          done()
        })
    })
  })
})
