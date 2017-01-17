/* global describe, it */
const assert = require('assert')

const Navigation = require('../lib/navigation')

const page = (id, children, path) => {
  return { id, children, path: (path || id) }
}

describe('Navigation', () => {
  describe('#forPageIdAsRoot', () => {
    it('should generate site navigation', (done) => {
      const state = {
        pages: {
          'index': page('index', ['child1', 'child2']),
          'child1': page('child1', ['child1/grandchild1', 'child1/grandchild2']),
          'child2': page('child2', ['child2/grandchild1']),
          'child1/grandchild1': page('child1/grandchild1', []),
          'child1/grandchild2': page('child1/grandchild2', []),
          'child2/grandchild1': page('child2/grandchild1', ['child2/grandchild1/greatgrandchild1']),
          'child2/grandchild1/greatgrandchild1': page('child2/grandchild1/greatgrandchild1', [])
        }
      }

      Navigation.forPageIdAsRoot(state, 'index')
        .then(function (result) {
          assert.equal(result.length, 1)

          const root = result[0]
          assert.equal(root.id, 'index')
          assert.equal(root.children.length, 2)

          const child1 = root.children[0]
          assert.equal(child1.id, 'child1')
          assert.equal(child1.children.length, 2)

          const child2 = root.children[1]
          assert.equal(child2.id, 'child2')
          assert.equal(child2.children.length, 1)

          const child1grandchild1 = child1.children[0]
          assert.equal(child1grandchild1.id, 'child1/grandchild1')
          assert.equal(child1grandchild1.children.length, 0)

          const child1grandchild2 = child1.children[1]
          assert.equal(child1grandchild2.id, 'child1/grandchild2')
          assert.equal(child1grandchild2.children.length, 0)

          const child2grandchild1 = child2.children[0]
          assert.equal(child2grandchild1.id, 'child2/grandchild1')
          assert.equal(child2grandchild1.children.length, 1)

          const child2grandchild1greatgrandchild1 = child2grandchild1.children[0]
          assert.equal(child2grandchild1greatgrandchild1.id, 'child2/grandchild1/greatgrandchild1')
          assert.equal(child2grandchild1greatgrandchild1.children.length, 0)

          done()
        })
        .catch(done)
    })

    it('should generate subtree navigation', (done) => {
      const state = {
        pages: {
          'index': page('index', ['child1', 'child2']),
          'child1': page('child1', ['child1/grandchild1']),
          'child1/grandchild1': page('child1/grandchild1', [])
        }
      }

      Navigation.forPageIdAsRoot(state, 'child1')
        .then(function (result) {
          assert.equal(result.length, 1)

          const child1 = result[0]
          assert.equal(child1.id, 'child1')
          assert.equal(child1.children.length, 1)

          const child1grandchild1 = child1.children[0]
          assert.equal(child1grandchild1.id, 'child1/grandchild1')
          assert.equal(child1grandchild1.children.length, 0)

          done()
        })
        .catch(done)
    })

    it('should take path from page config if explicitely provided', (done) => {
      const state = {
        pages: {
          'child1': page('child1', [], 'childpage/path/explicit')
        }
      }

      Navigation.forPageIdAsRoot(state, 'child1')
        .then(function (result) {
          assert.equal(result.length, 1)

          const root = result[0]
          assert.equal(root.id, 'child1')
          assert.equal(root.path, 'childpage/path/explicit')

          done()
        })
        .catch(done)
    })

    it('should throw error if page does not exist', (done) => {
      const state = { pages: {} }
      Navigation.forPageIdAsRoot(state, 'index')
        .catch(function (error) {
          assert(error)
          done()
        })
    })
  })
})
