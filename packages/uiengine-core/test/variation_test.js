/* global describe, it */
const path = require('path')
const assert = require('assert')

const Variation = require('../src/variation')

const projectPath = path.resolve(__dirname, 'project')
const state = {
  config: {
    source: {
      components: path.resolve(projectPath, 'src', 'components')
    },
    adapters: {
      pug: {
        module: 'uiengine-adapter-pug',
        options: {
          pretty: true,
          basedir: path.resolve(projectPath, 'src', 'components')
        }
      },
      jsx: {
        module: 'uiengine-adapter-react',
        options: {}
      },
      hbs: {
        module: 'uiengine-adapter-handlebars',
        options: {}
      }
    }
  }
}

describe('Variation', () => {
  describe('#fetchById', () => {
    it('should return variation object', done => {
      Variation.fetchById(state, 'input/text.pug')
        .then(data => {
          assert.equal(data.id, 'input/text.pug')
          assert.equal(data.title, 'Text Input')
          assert.equal(data.content, '<p>This is documentation for the text input.</p>')
          assert.equal(data.context.id, 'name')
          assert.equal(data.context.name, 'person[name]')
          assert.equal(data.raw, 'include /input/input.pug\n\n+input(id, name)')
          assert.equal(data.rendered, '<input class="input input--text" id="name" name="person[name]" type="text"/>')
          assert.equal(data.extension, 'pug')

          done()
        })
        .catch(done)
    })

    it('should infer variation title if it is not provided', done => {
      Variation.fetchById(state, 'form/form.pug')
        .then(data => {
          assert.equal(data.title, 'Form')
          done()
        })
        .catch(done)
    })

    it('should parse attributes with custom yaml types', done => {
      Variation.fetchById(state, 'input/text-disabled.pug')
        .then(data => {
          assert.equal(data.included_md, '<h1 id="homepage">Homepage</h1>\n<p>Welcome!</p>')
          assert.equal(data.content_md, '<h1 id="headline">Headline</h1>\n<p>Text paragraph</p>')
          assert.equal(data.context.number, 4)
          done()
        })
        .catch(done)
    })
  })

  describe('#fetchAll', () => {
    it('should return variations object', done => {
      Variation.fetchAll(state)
        .then(data => {
          const variationIds = Object.keys(data)

          assert.equal(variationIds.length, 12);

          [ 'input/checkbox.pug',
            'input/number.pug',
            'input/text.hbs',
            'input/text.pug',
            'input/text-disabled.pug',
            'input/text-required.pug',
            'label/label.hbs',
            'label/label.jsx',
            'label/label.pug',
            'formrow/text-with-label.pug',
            'formrow/text-without-label.pug',
            'form/form.pug'
          ].map(id => {
            assert(variationIds.includes(id), `missing variation "${id}"`)
          })

          done()
        })
        .catch(done)
    })

    it('should return empty object if components source is not set', done => {
      Variation.fetchAll({ config: { source: { } } })
        .then(data => {
          const variationIds = Object.keys(data)

          assert.equal(variationIds.length, 0)
          done()
        })
        .catch(done)
    })
  })
})
