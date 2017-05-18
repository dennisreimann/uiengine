/* global describe, it */
const R = require('ramda')
const assert = require('assert')
const Factory = require('./support/factory')

const Navigation = require('../src/navigation')

const state = {
  components: {
    'button': Factory.component('button', { title: 'Awesome Button' }),
    'link': Factory.component('link', { title: 'Link' })
  },
  pages: {
    'index': Factory.page('index', { title: 'Home', childIds: ['atoms', 'molecules'] }),
    'atoms': Factory.page('atoms', { title: 'Atoms', childIds: ['atoms/docs', 'atoms/more-docs'], componentIds: ['link', 'button'] }),
    'molecules': Factory.page('molecules', { title: 'Molecules' }),
    'atoms/docs': Factory.page('atoms/docs', { title: 'Atom Docs' }),
    'atoms/more-docs': Factory.page('atoms/more-docs', { title: 'More Atom Docs' })
  }
}

describe('Navigation', () => {
  describe('#fetch', () => {
    it('should generate site navigation', done => {
      Navigation.fetch(state)
        .then(data => {
          assert.equal(Object.keys(data).length, 7)

          assert(data['index'])
          assert(data['atoms'])
          assert(data['molecules'])
          assert(data['atoms/docs'])
          assert(data['atoms/more-docs'])
          assert(data['atoms/button'])
          assert(data['atoms/link'])

          const index = data['index']
          assert.equal(index.id, 'index')
          assert.equal(index.path, '')
          assert.equal(index.title, 'Home')
          assert.equal(index.childIds.length, 2)
          assert.equal(index.childIds[0], 'atoms')
          assert.equal(index.childIds[1], 'molecules')
          assert.equal(index.parentId, null)
          assert.equal(index.parentIds.length, 0)
          assert.equal(index.siblingBeforeId, null)
          assert.equal(index.siblingsBeforeIds.length, 0)
          assert.equal(index.siblingsAfterIds.length, 0)
          assert.equal(index.siblingAfterId, null)

          const atoms = data['atoms']
          assert.equal(atoms.id, 'atoms')
          assert.equal(atoms.path, 'atoms')
          assert.equal(atoms.title, 'Atoms')
          assert.equal(atoms.childIds.length, 4)
          assert.equal(atoms.childIds[0], 'atoms/docs')
          assert.equal(atoms.childIds[1], 'atoms/more-docs')
          assert.equal(atoms.childIds[2], 'atoms/link')
          assert.equal(atoms.childIds[3], 'atoms/button')
          assert.equal(atoms.parentId, 'index')
          assert.equal(atoms.parentIds.length, 1)
          assert.equal(atoms.parentIds[0], 'index')
          assert.equal(atoms.siblingBeforeId, null)
          assert.equal(atoms.siblingsBeforeIds.length, 0)
          assert.equal(atoms.siblingsAfterIds.length, 1)
          assert.equal(atoms.siblingsAfterIds[0], 'molecules')
          assert.equal(atoms.siblingAfterId, 'molecules')

          const molecules = data['molecules']
          assert.equal(molecules.id, 'molecules')
          assert.equal(molecules.path, 'molecules')
          assert.equal(molecules.title, 'Molecules')
          assert.equal(molecules.childIds.length, 0)
          assert.equal(molecules.parentId, 'index')
          assert.equal(molecules.parentIds.length, 1)
          assert.equal(molecules.parentIds[0], 'index')
          assert.equal(molecules.siblingBeforeId, 'atoms')
          assert.equal(molecules.siblingsBeforeIds.length, 1)
          assert.equal(molecules.siblingsBeforeIds[0], 'atoms')
          assert.equal(molecules.siblingsAfterIds.length, 0)
          assert.equal(molecules.siblingAfterId, null)

          const atomsDocs = data['atoms/docs']
          assert.equal(atomsDocs.id, 'atoms/docs')
          assert.equal(atomsDocs.path, 'atoms/docs')
          assert.equal(atomsDocs.title, 'Atom Docs')
          assert.equal(atomsDocs.childIds.length, 0)
          assert.equal(atomsDocs.parentId, 'atoms')
          assert.equal(atomsDocs.parentIds.length, 2)
          assert.equal(atomsDocs.parentIds[0], 'index')
          assert.equal(atomsDocs.parentIds[1], 'atoms')
          assert.equal(atomsDocs.siblingBeforeId, null)
          assert.equal(atomsDocs.siblingsBeforeIds.length, 0)
          assert.equal(atomsDocs.siblingsAfterIds.length, 3)
          assert.equal(atomsDocs.siblingsAfterIds[0], 'atoms/more-docs')
          assert.equal(atomsDocs.siblingsAfterIds[1], 'atoms/link')
          assert.equal(atomsDocs.siblingsAfterIds[2], 'atoms/button')
          assert.equal(atomsDocs.siblingAfterId, 'atoms/more-docs')

          const atomsMoreDocs = data['atoms/more-docs']
          assert.equal(atomsMoreDocs.id, 'atoms/more-docs')
          assert.equal(atomsMoreDocs.path, 'atoms/more-docs')
          assert.equal(atomsMoreDocs.title, 'More Atom Docs')
          assert.equal(atomsMoreDocs.childIds.length, 0)
          assert.equal(atomsMoreDocs.parentId, 'atoms')
          assert.equal(atomsMoreDocs.parentIds.length, 2)
          assert.equal(atomsMoreDocs.parentIds[0], 'index')
          assert.equal(atomsMoreDocs.parentIds[1], 'atoms')
          assert.equal(atomsMoreDocs.siblingBeforeId, 'atoms/docs')
          assert.equal(atomsMoreDocs.siblingsBeforeIds.length, 1)
          assert.equal(atomsMoreDocs.siblingsBeforeIds[0], 'atoms/docs')
          assert.equal(atomsMoreDocs.siblingsAfterIds.length, 2)
          assert.equal(atomsMoreDocs.siblingsAfterIds[0], 'atoms/link')
          assert.equal(atomsMoreDocs.siblingsAfterIds[1], 'atoms/button')
          assert.equal(atomsMoreDocs.siblingAfterId, 'atoms/link')

          const atomsLink = data['atoms/link']
          assert.equal(atomsLink.id, 'atoms/link')
          assert.equal(atomsLink.path, 'atoms/link')
          assert.equal(atomsLink.title, 'Link')
          assert.equal(atomsLink.childIds.length, 0)
          assert.equal(atomsLink.parentId, 'atoms')
          assert.equal(atomsLink.parentIds.length, 2)
          assert.equal(atomsLink.parentIds[0], 'index')
          assert.equal(atomsLink.parentIds[1], 'atoms')
          assert.equal(atomsLink.siblingBeforeId, 'atoms/more-docs')
          assert.equal(atomsLink.siblingsBeforeIds.length, 2)
          assert.equal(atomsLink.siblingsBeforeIds[0], 'atoms/docs')
          assert.equal(atomsLink.siblingsBeforeIds[1], 'atoms/more-docs')
          assert.equal(atomsLink.siblingsAfterIds.length, 1)
          assert.equal(atomsLink.siblingsAfterIds[0], 'atoms/button')
          assert.equal(atomsLink.siblingAfterId, 'atoms/button')

          const atomsButton = data['atoms/button']
          assert.equal(atomsButton.id, 'atoms/button')
          assert.equal(atomsButton.path, 'atoms/button')
          assert.equal(atomsButton.title, 'Awesome Button')
          assert.equal(atomsButton.childIds.length, 0)
          assert.equal(atomsButton.parentId, 'atoms')
          assert.equal(atomsButton.parentIds.length, 2)
          assert.equal(atomsButton.parentIds[0], 'index')
          assert.equal(atomsButton.parentIds[1], 'atoms')
          assert.equal(atomsButton.siblingBeforeId, 'atoms/link')
          assert.equal(atomsButton.siblingsBeforeIds.length, 3)
          assert.equal(atomsButton.siblingsBeforeIds[0], 'atoms/docs')
          assert.equal(atomsButton.siblingsBeforeIds[1], 'atoms/more-docs')
          assert.equal(atomsButton.siblingsBeforeIds[2], 'atoms/link')
          assert.equal(atomsButton.siblingsAfterIds.length, 0)
          assert.equal(atomsButton.siblingAfterId, null)

          done()
        })
        .catch(done)
    })
  })

  describe('#fetchForPageId', () => {
    it('should generate page navigation item', done => {
      const state = {
        pages: {
          'index': Factory.page('index', { childIds: ['child1'] }),
          'child1': Factory.page('child1', { childIds: ['child1/grandchild1'] }),
          'child1/grandchild1': Factory.page('child1/grandchild1', { childIds: ['child1/grandchild1/greatgrandchild1'] }),
          'child1/grandchild1/greatgrandchild1': Factory.page('child1/grandchild1/greatgrandchild1')
        }
      }

      Navigation.fetchForPageId(state, 'child1/grandchild1')
        .then(navItems => {
          assert.equal(navItems.length, 1)

          const pageNav = navItems[0]
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
      Navigation.fetchForPageId(state, 'index')
        .catch(error => {
          assert(error)
          done()
        })
    })

    it('should throw an error if component does not exist', done => {
      const testState = R.assoc('components', {}, state)

      Navigation.fetchForPageId(testState, 'atoms')
        .catch(error => {
          assert(error)
          done()
        })
    })

    it('should generate components navigation items', done => {
      Navigation.fetchForPageId(state, 'atoms')
        .then(navItems => {
          assert.equal(navItems.length, 3)

          const atoms = navItems[0]
          assert.equal(atoms.id, 'atoms')

          const link = navItems[1]
          assert.equal(link.id, 'atoms/link')

          const button = navItems[2]
          assert.equal(button.id, 'atoms/button')

          done()
        })
        .catch(done)
    })
  })
})
