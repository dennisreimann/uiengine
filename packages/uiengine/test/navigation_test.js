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
    'index': Factory.page('index', { title: 'Home', childIds: ['atoms', 'molecules'], content: '<h1>Homepage</h1>\n<p>This is some content.</p>' }),
    'atoms': Factory.page('atoms', { title: 'Atoms', childIds: ['atoms/docs', 'atoms/more-docs'], componentIds: ['link', 'button'] }),
    'molecules': Factory.page('molecules', { title: 'Molecules' }),
    'atoms/docs': Factory.page('atoms/docs', { title: 'Atom Docs' }),
    'atoms/more-docs': Factory.page('atoms/more-docs', { title: 'More Atom Docs' })
  }
}

describe('Navigation', () => {
  describe('#fetch', () => {
    it('should generate site navigation', async () => {
      const data = await Navigation.fetch(state)

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
      assert.equal(index.path, '/')
      assert.equal(index.title, 'Home')
      assert.equal(index.type, 'documentation')
      assert.equal(index.isStructural, false) // has content
      assert.equal(index.childIds.length, 2)
      assert.equal(index.childIds[0], 'atoms')
      assert.equal(index.childIds[1], 'molecules')
      assert.equal(index.parentId, undefined)
      assert.equal(index.prevSiblingId, undefined)
      assert.equal(index.nextSiblingId, undefined)

      const atoms = data['atoms']
      assert.equal(atoms.id, 'atoms')
      assert.equal(atoms.path, '/atoms/')
      assert.equal(atoms.title, 'Atoms')
      assert.equal(atoms.type, 'documentation')
      assert.equal(atoms.isStructural, true) // has components, but no content
      assert.equal(atoms.childIds.length, 4)
      assert.equal(atoms.childIds[0], 'atoms/docs')
      assert.equal(atoms.childIds[1], 'atoms/more-docs')
      assert.equal(atoms.childIds[2], 'atoms/link')
      assert.equal(atoms.childIds[3], 'atoms/button')
      assert.equal(atoms.parentId, 'index')
      assert.equal(atoms.prevSiblingId, undefined)
      assert.equal(atoms.nextSiblingId, 'molecules')

      const molecules = data['molecules']
      assert.equal(molecules.id, 'molecules')
      assert.equal(molecules.path, '/molecules/')
      assert.equal(molecules.title, 'Molecules')
      assert.equal(molecules.type, 'documentation')
      assert.equal(molecules.isStructural, true) // has components, but no content
      assert.equal(molecules.childIds, undefined)
      assert.equal(molecules.parentId, 'index')
      assert.equal(molecules.prevSiblingId, 'atoms')
      assert.equal(molecules.nextSiblingId, undefined)

      const atomsDocs = data['atoms/docs']
      assert.equal(atomsDocs.id, 'atoms/docs')
      assert.equal(atomsDocs.path, '/atoms/docs/')
      assert.equal(atomsDocs.title, 'Atom Docs')
      assert.equal(atomsDocs.isStructural, true)
      assert.equal(atomsDocs.childIds, undefined)
      assert.equal(atomsDocs.parentId, 'atoms')
      assert.equal(atomsDocs.prevSiblingId, undefined)
      assert.equal(atomsDocs.nextSiblingId, 'atoms/more-docs')

      const atomsMoreDocs = data['atoms/more-docs']
      assert.equal(atomsMoreDocs.id, 'atoms/more-docs')
      assert.equal(atomsMoreDocs.path, '/atoms/more-docs/')
      assert.equal(atomsMoreDocs.title, 'More Atom Docs')
      assert.equal(atomsMoreDocs.isStructural, true)
      assert.equal(atomsMoreDocs.childIds, undefined)
      assert.equal(atomsMoreDocs.parentId, 'atoms')
      assert.equal(atomsMoreDocs.prevSiblingId, 'atoms/docs')
      assert.equal(atomsMoreDocs.nextSiblingId, 'atoms/link')

      const atomsLink = data['atoms/link']
      assert.equal(atomsLink.id, 'atoms/link')
      assert.equal(atomsLink.path, '/atoms/link/')
      assert.equal(atomsLink.title, 'Link')
      assert.equal(atomsLink.isStructural, false)
      assert.equal(atomsLink.childIds, undefined)
      assert.equal(atomsLink.parentId, 'atoms')
      assert.equal(atomsLink.prevSiblingId, 'atoms/more-docs')
      assert.equal(atomsLink.nextSiblingId, 'atoms/button')

      const atomsButton = data['atoms/button']
      assert.equal(atomsButton.id, 'atoms/button')
      assert.equal(atomsButton.path, '/atoms/button/')
      assert.equal(atomsButton.title, 'Awesome Button')
      assert.equal(atomsButton.isStructural, false)
      assert.equal(atomsButton.childIds, undefined)
      assert.equal(atomsButton.parentId, 'atoms')
      assert.equal(atomsButton.prevSiblingId, 'atoms/link')
      assert.equal(atomsButton.nextSiblingId, undefined)
    })
  })

  describe('#fetchForPageId', () => {
    it('should generate page navigation item', async () => {
      const state = {
        pages: {
          'index': Factory.page('index', { childIds: ['child1'], content: '# Home' }),
          'child1': Factory.page('child1', { childIds: ['child1/grandchild1'] }),
          'child1/grandchild1': Factory.page('child1/grandchild1', { childIds: ['child1/grandchild1/greatgrandchild1'], content: '# Grandchild 1' }),
          'child1/grandchild1/greatgrandchild1': Factory.page('child1/grandchild1/greatgrandchild1')
        }
      }
      const navItems = await Navigation.fetchForPageId(state, 'child1/grandchild1')
      const pageNav = navItems[0]

      assert.equal(navItems.length, 1)
      assert.equal(pageNav.id, 'child1/grandchild1')
      assert.equal(pageNav.childIds.length, 1)
      assert.equal(pageNav.childIds[0], 'child1/grandchild1/greatgrandchild1')
      assert.equal(pageNav.parentId, 'child1')
    })

    it('should throw error if page does not exist', async () => {
      const state = { pages: {} }

      try {
        await Navigation.fetchForPageId(state, 'index')
      } catch (error) {
        assert(error)
      }
    })

    it('should throw an error if component does not exist', async () => {
      const testState = R.assoc('components', {}, state)

      try {
        await Navigation.fetchForPageId(testState, 'atoms')
      } catch (error) {
        assert(error)
      }
    })

    it('should generate components navigation items', async () => {
      const navItems = await Navigation.fetchForPageId(state, 'atoms')

      assert.equal(navItems.length, 3)
      assert.equal(navItems[0].id, 'atoms')
      assert.equal(navItems[1].id, 'atoms/link')
      assert.equal(navItems[2].id, 'atoms/button')
    })
  })
})
