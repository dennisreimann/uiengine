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

      assert.strictEqual(Object.keys(data).length, 7)

      assert(data['index'])
      assert(data['atoms'])
      assert(data['molecules'])
      assert(data['atoms/docs'])
      assert(data['atoms/more-docs'])
      assert(data['atoms/button'])
      assert(data['atoms/link'])

      const index = data['index']
      assert.strictEqual(index.id, 'index')
      assert.strictEqual(index.path, '/')
      assert.strictEqual(index.title, 'Home')
      assert.strictEqual(index.type, 'documentation')
      assert.strictEqual(index.isStructural, undefined) // has content
      assert.strictEqual(index.childIds.length, 2)
      assert.strictEqual(index.childIds[0], 'atoms')
      assert.strictEqual(index.childIds[1], 'molecules')
      assert.strictEqual(index.parentId, undefined)
      assert.strictEqual(index.prevSiblingId, undefined)
      assert.strictEqual(index.nextSiblingId, undefined)

      const atoms = data['atoms']
      assert.strictEqual(atoms.id, 'atoms')
      assert.strictEqual(atoms.path, '/atoms/')
      assert.strictEqual(atoms.title, 'Atoms')
      assert.strictEqual(atoms.type, 'documentation')
      assert.strictEqual(atoms.isStructural, true) // has components, but no content
      assert.strictEqual(atoms.childIds.length, 4)
      assert.strictEqual(atoms.childIds[0], 'atoms/docs')
      assert.strictEqual(atoms.childIds[1], 'atoms/more-docs')
      assert.strictEqual(atoms.childIds[2], 'atoms/link')
      assert.strictEqual(atoms.childIds[3], 'atoms/button')
      assert.strictEqual(atoms.parentId, 'index')
      assert.strictEqual(atoms.prevSiblingId, undefined)
      assert.strictEqual(atoms.nextSiblingId, 'molecules')

      const molecules = data['molecules']
      assert.strictEqual(molecules.id, 'molecules')
      assert.strictEqual(molecules.path, '/molecules/')
      assert.strictEqual(molecules.title, 'Molecules')
      assert.strictEqual(molecules.type, 'documentation')
      assert.strictEqual(molecules.isStructural, true) // has components, but no content
      assert.strictEqual(molecules.childIds, undefined)
      assert.strictEqual(molecules.parentId, 'index')
      assert.strictEqual(molecules.prevSiblingId, 'atoms')
      assert.strictEqual(molecules.nextSiblingId, undefined)

      const atomsDocs = data['atoms/docs']
      assert.strictEqual(atomsDocs.id, 'atoms/docs')
      assert.strictEqual(atomsDocs.path, '/atoms/docs/')
      assert.strictEqual(atomsDocs.title, 'Atom Docs')
      assert.strictEqual(atomsDocs.isStructural, true)
      assert.strictEqual(atomsDocs.childIds, undefined)
      assert.strictEqual(atomsDocs.parentId, 'atoms')
      assert.strictEqual(atomsDocs.prevSiblingId, undefined)
      assert.strictEqual(atomsDocs.nextSiblingId, 'atoms/more-docs')

      const atomsMoreDocs = data['atoms/more-docs']
      assert.strictEqual(atomsMoreDocs.id, 'atoms/more-docs')
      assert.strictEqual(atomsMoreDocs.path, '/atoms/more-docs/')
      assert.strictEqual(atomsMoreDocs.title, 'More Atom Docs')
      assert.strictEqual(atomsMoreDocs.isStructural, true)
      assert.strictEqual(atomsMoreDocs.childIds, undefined)
      assert.strictEqual(atomsMoreDocs.parentId, 'atoms')
      assert.strictEqual(atomsMoreDocs.prevSiblingId, 'atoms/docs')
      assert.strictEqual(atomsMoreDocs.nextSiblingId, 'atoms/link')

      const atomsLink = data['atoms/link']
      assert.strictEqual(atomsLink.id, 'atoms/link')
      assert.strictEqual(atomsLink.path, '/atoms/link/')
      assert.strictEqual(atomsLink.title, 'Link')
      assert.strictEqual(atomsLink.isStructural, undefined)
      assert.strictEqual(atomsLink.childIds, undefined)
      assert.strictEqual(atomsLink.parentId, 'atoms')
      assert.strictEqual(atomsLink.prevSiblingId, 'atoms/more-docs')
      assert.strictEqual(atomsLink.nextSiblingId, 'atoms/button')

      const atomsButton = data['atoms/button']
      assert.strictEqual(atomsButton.id, 'atoms/button')
      assert.strictEqual(atomsButton.path, '/atoms/button/')
      assert.strictEqual(atomsButton.title, 'Awesome Button')
      assert.strictEqual(atomsButton.isStructural, undefined)
      assert.strictEqual(atomsButton.childIds, undefined)
      assert.strictEqual(atomsButton.parentId, 'atoms')
      assert.strictEqual(atomsButton.prevSiblingId, 'atoms/link')
      assert.strictEqual(atomsButton.nextSiblingId, undefined)
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

      assert.strictEqual(navItems.length, 1)
      assert.strictEqual(pageNav.id, 'child1/grandchild1')
      assert.strictEqual(pageNav.childIds.length, 1)
      assert.strictEqual(pageNav.childIds[0], 'child1/grandchild1/greatgrandchild1')
      assert.strictEqual(pageNav.parentId, 'child1')
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

      assert.strictEqual(navItems.length, 3)
      assert.strictEqual(navItems[0].id, 'atoms')
      assert.strictEqual(navItems[1].id, 'atoms/link')
      assert.strictEqual(navItems[2].id, 'atoms/button')
    })
  })
})
