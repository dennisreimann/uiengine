const { resolve } = require('path')
const R = require('ramda')
const assert = require('assert')
const { assertMatches } = require('../../../test/support/asserts')

const Variant = require('../src/variant')

const { testProjectPath } = require('../../../test/support/paths')
const { adapters } = require('./support/adapters')
const componentsPath = resolve(testProjectPath, 'src', 'components')

const state = {
  config: {
    source: {
      components: componentsPath,
      data: resolve(__dirname, 'fixtures'),
      base: testProjectPath
    },
    adapters
  }
}

describe('Variant', () => {
  describe('#fetchObject', () => {
    it('should return variant object', async () => {
      const data = await Variant.fetchObject(state, 'input', {}, {
        file: 'text.pug',
        title: 'Text Input',
        description: '<p>This is documentation for the text input.</p>',
        context: {
          id: 'name',
          name: 'person[name]'
        }
      })

      assert.strictEqual(data.id, 'input/text.pug')
      assert.strictEqual(data.title, 'Text Input')
      assert.strictEqual(data.description, '<p>This is documentation for the text input.</p>')
      assert.strictEqual(data.extension, 'pug')
      assert.strictEqual(data.context.id, 'name')
      assert.strictEqual(data.context.name, 'person[name]')
      assertMatches(data.rendered, /<input class="input input--text" id="name" name="person\[name\]" type="text"\/>/g)
      assertMatches(data.raw, /include \/input\/input\.pug/)
      assertMatches(data.raw, /\+input\(id, name\)/)
    })

    it('should infer variant title if it is not provided', async () => {
      const data = await Variant.fetchObject(state, 'form', {}, { file: 'form.pug' })

      assert.strictEqual(data.title, 'Form')
    })

    it('should use component context if variant context is not present', async () => {
      const data = await Variant.fetchObject(state, 'label', { number: 3 }, { file: 'label.html' })

      assert.strictEqual(data.context.number, 3)
    })

    it('should prefer variant context over component context', async () => {
      const data = await Variant.fetchObject(state, 'label', { number: 3 }, { file: 'label.html', context: { number: 4 } })

      assert.strictEqual(data.context.number, 4)
    })
  })

  describe('#fetchObjects', () => {
    it('should find variants if list is not provided', async () => {
      const variants = await Variant.fetchObjects(state, 'input')

      assert.strictEqual(variants.length, 6);

      [ 'input/checkbox.pug',
        'input/number.pug',
        'input/text.hbs',
        'input/text.pug',
        'input/text-disabled.pug',
        'input/text-required.pug'
      ].map(id => {
        assert(R.find(variant => variant.id === id, variants), `missing variant "${id}"`)
      })
    })

    it('should convert variants to objects if list consists of filenames', async () => {
      const variants = await Variant.fetchObjects(state, 'input', {}, ['checkbox.pug', 'text.pug'])

      assert.strictEqual(variants.length, 2);

      [ 'input/checkbox.pug',
        'input/text.pug'
      ].map(id => {
        assert(R.find(variant => variant.id === id, variants), `missing variant "${id}"`)
      })
    })

    it('should use variants if list consists of objects', async () => {
      const variants = await Variant.fetchObjects(state, 'input', {}, [
        { file: 'checkbox.pug' },
        { file: 'text.pug' }
      ])

      assert.strictEqual(variants.length, 2);

      [ 'input/checkbox.pug',
        'input/text.pug'
      ].map(id => {
        assert(R.find(variant => variant.id === id, variants), `missing variant "${id}"`)
      })
    })

    it('should return empty list if components source is not set', async () => {
      const variants = await Variant.fetchObjects({ config: { source: { } } })

      assert.strictEqual(variants.length, 0)
    })
  })
})
