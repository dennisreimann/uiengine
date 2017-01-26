/* global describe, it */
const assert = require('assert')
const Factory = require('./support/factory')

const Navigation = require('../lib/navigation')

describe('Navigation', () => {
  describe('#forPages', () => {
    it('should generate site navigation', done => {
      const state = {
        pages: {
          'index': Factory.page('index', { children: ['child1', 'child2'] }),
          'child1': Factory.page('child1', { children: ['child1/grandchild1', 'child1/grandchild2'] }),
          'child2': Factory.page('child2', { children: ['child2/grandchild1'] }),
          'child1/grandchild1': Factory.page('child1/grandchild1', { children: ['child1/grandchild1/greatgrandchild1'] }),
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
          assert.equal(index.children.length, 2)
          assert.equal(index.parentId, null)
          assert.equal(index.parentIds.length, 0)

          const child1 = data['child1']
          assert.equal(child1.id, 'child1')
          assert.equal(child1.children.length, 2)
          assert.equal(child1.parentId, 'index')
          assert.equal(child1.parentIds.length, 1)
          assert.equal(child1.parentIds[0], 'index')

          const child2 = data['child2']
          assert.equal(child2.id, 'child2')
          assert.equal(child2.children.length, 1)
          assert.equal(child2.parentId, 'index')
          assert.equal(child1.parentIds.length, 1)
          assert.equal(child1.parentIds[0], 'index')

          const child1grandchild1 = data['child1/grandchild1']
          assert.equal(child1grandchild1.id, 'child1/grandchild1')
          assert.equal(child1grandchild1.children.length, 1)
          assert.equal(child1grandchild1.parentId, 'child1')
          assert.equal(child1grandchild1.parentIds.length, 2)
          assert.equal(child1grandchild1.parentIds[0], 'index')
          assert.equal(child1grandchild1.parentIds[1], 'child1')

          const child1grandchild2 = data['child1/grandchild2']
          assert.equal(child1grandchild2.id, 'child1/grandchild2')
          assert.equal(child1grandchild2.children.length, 0)
          assert.equal(child1grandchild2.parentId, 'child1')
          assert.equal(child1grandchild1.parentIds.length, 2)
          assert.equal(child1grandchild1.parentIds[0], 'index')
          assert.equal(child1grandchild1.parentIds[1], 'child1')

          const child2grandchild1greatgrandchild1 = data['child1/grandchild1/greatgrandchild1']
          assert.equal(child2grandchild1greatgrandchild1.id, 'child1/grandchild1/greatgrandchild1')
          assert.equal(child2grandchild1greatgrandchild1.children.length, 0)
          assert.equal(child2grandchild1greatgrandchild1.parentId, 'child1/grandchild1')
          assert.equal(child2grandchild1greatgrandchild1.parentIds.length, 3)
          assert.equal(child2grandchild1greatgrandchild1.parentIds[0], 'index')
          assert.equal(child2grandchild1greatgrandchild1.parentIds[1], 'child1')
          assert.equal(child2grandchild1greatgrandchild1.parentIds[2], 'child1/grandchild1')

          done()
        })
        .catch(done)
    })
  })

  describe('#forPageId', () => {
    it('should generate page navigation', done => {
      const state = {
        pages: {
          'index': Factory.page('index', { children: ['child1'] }),
          'child1': Factory.page('child1', { children: ['child1/grandchild1'] }),
          'child1/grandchild1': Factory.page('child1/grandchild1', { children: ['child1/grandchild1/greatgrandchild1'] }),
          'child1/grandchild1/greatgrandchild1': Factory.page('child1/grandchild1/greatgrandchild1')
        }
      }

      Navigation.forPageId(state, 'child1/grandchild1')
        .then(pageNav => {
          assert.equal(pageNav.id, 'child1/grandchild1')
          assert.equal(pageNav.children.length, 1)
          assert.equal(pageNav.children[0], 'child1/grandchild1/greatgrandchild1')
          assert.equal(pageNav.parentId, 'child1')
          assert.equal(pageNav.parentIds.length, 2)
          assert.equal(pageNav.parentIds[0], 'index')
          assert.equal(pageNav.parentIds[1], 'child1')

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
