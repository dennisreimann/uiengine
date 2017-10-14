const path = require('path')
const assert = require('assert')

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
          assert.equal(data.raw, 'include /input/input.pug\n\n+input(id, name)')
          assert.equal(data.rendered, '<input class="input input--text" id="name" name="person[name]" type="text"/>')
          assert.equal(data.extension, 'pug')

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
          assert.equal(data.raw, `
include /form/form.pug
include /formrow/formrow.pug
include /input/input.pug
include /label/label.pug

+form("#")
  +formrow()
  +formrow()
    +label("last_name", "Last name")
    +input("last_name", "person[last_name]")
  +formrow()`.trim())
          done()
        })
        .catch(done)
    })

    it('should omit marked parts in preview', done => {
      Variant.fetchById(state, 'form/form.pug')
        .then(data => {
          assert.equal(data.rendered, `
<form class="form" action="#" type="GET">
  <div class="form__row">
    <label class="label" for="first_name">First name
    </label>
    <input class="input input--text" id="first_name" name="person[first_name]" type="text"/>
  </div>
  <div class="form__row">
  </div>
  <div class="form__row">
  </div>
</form>`.trim())
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

          assert.equal(variantIds.length, 13);

          [ 'input/checkbox.pug',
            'input/number.pug',
            'input/text.hbs',
            'input/text.pug',
            'input/text-disabled.pug',
            'input/text-required.pug',
            'label/label.hbs',
            'label/label.jsx',
            'label/label.marko',
            'label/label.pug',
            'formrow/text-with-label.pug',
            'formrow/text-without-label.pug',
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
