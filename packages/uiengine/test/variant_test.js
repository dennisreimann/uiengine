const path = require('path')
const assert = require('assert')
const assertMatches = require('./support/assertMatches')
const assertDoesNotMatch = require('./support/assertDoesNotMatch')

const Variant = require('../src/variant')

const { testProjectPath } = require('../../../test/support/paths')
const componentsPath = path.resolve(testProjectPath, 'src', 'components')

const state = {
  config: {
    source: {
      components: componentsPath,
      data: path.resolve(__dirname, 'fixtures'),
      base: testProjectPath
    },
    adapters: {
      pug: {
        module: 'uiengine-adapter-pug',
        options: {
          pretty: true,
          basedir: componentsPath
        }
      },
      html: {
        module: 'uiengine-adapter-html',
        options: {
          basedir: componentsPath
        }
      },
      jsx: {
        module: 'uiengine-adapter-react',
        options: {}
      },
      hbs: {
        module: 'uiengine-adapter-handlebars',
        options: {}
      },
      marko: {
        module: 'uiengine-adapter-marko',
        options: {}
      }
    }
  }
}

describe('Variant', () => {
  describe('#fetchById', () => {
    it('should return variant object', done => {
      Variant.fetchById(state, 'input/text.pug')
        .then(data => {
          assert.equal(data.id, 'input/text.pug')
          assert.equal(data.title, 'Text Input')
          assert.equal(data.content, '<p>This is documentation for the text input.</p>')
          assert.equal(data.context.id, 'name')
          assert.equal(data.context.name, 'person[name]')
          assert.equal(data.extension, 'pug')

          assertMatches(data.rendered, /<input class="input input--text" id="name" name="person\[name\]" type="text"\/>/g)
          assertMatches(data.raw, /include \/input\/input\.pug/)
          assertMatches(data.raw, /\+input\(id, name\)/)

          done()
        })
        .catch(done)
    })

    it('should infer variant title if it is not provided', done => {
      Variant.fetchById(state, 'form/form.pug')
        .then(data => {
          assert.equal(data.title, 'Form')
          done()
        })
        .catch(done)
    })

    it('should parse attributes with custom yaml types', done => {
      Variant.fetchById(state, 'input/text-disabled.pug')
        .then(data => {
          assert.equal(data.included_md, '<h1 id="homepage">Homepage</h1>\n<p>Welcome!</p>')
          assert.equal(data.content_md, '<h1 id="headline">Headline</h1>\n<p>Text paragraph</p>')
          assert.equal(data.context.number, 4)
          done()
        })
        .catch(done)
    })

    it('should omit marked parts in code', done => {
      Variant.fetchById(state, 'form/form.pug')
        .then(data => {
          assertDoesNotMatch(data.raw, /\+input\("username", "person\[username\]"\)/g)
          assertMatches(data.raw, /\+input\("password", "person\[password\]", "Password"\)/g)

          done()
        })
        .catch(done)
    })

    it('should omit marked parts in preview', done => {
      Variant.fetchById(state, 'form/form.pug')
        .then(data => {
          assertDoesNotMatch(data.rendered, /<input class="input input--password" id="password" name="person\[password\]" type="password"\/>/g)
          assertMatches(data.rendered, /<input class="input input--text" id="username" name="person\[username\]" type="text"\/>/g)

          done()
        })
        .catch(done)
    })
  })

  describe('#fetchAll', () => {
    it('should return variants object', done => {
      Variant.fetchAll(state)
        .then(data => {
          const variantIds = Object.keys(data)

          assert.equal(variantIds.length, 14);

          [ 'input/checkbox.pug',
            'input/number.pug',
            'input/text.hbs',
            'input/text.pug',
            'input/text-disabled.pug',
            'input/text-required.pug',
            'label/label.hbs',
            'label/label.html',
            'label/label.jsx',
            'label/label.marko',
            'label/label.pug',
            'formfield/text-with-label.pug',
            'formfield/text-without-label.pug',
            'form/form.pug'
          ].map(id => {
            assert(variantIds.includes(id), `missing variant "${id}"`)
          })

          done()
        })
        .catch(done)
    })

    it('should return empty object if components source is not set', done => {
      Variant.fetchAll({ config: { source: { } } })
        .then(data => {
          const variantIds = Object.keys(data)

          assert.equal(variantIds.length, 0)
          done()
        })
        .catch(done)
    })
  })
})
