const { resolve } = require('path')
const assert = require('assert')
const assertMatches = require('../../../test/support/assertMatches')
const assertDoesNotMatch = require('../../../test/support/assertDoesNotMatch')

const Variant = require('../src/variant')

const { testProjectPath } = require('../../../test/support/paths')
const componentsPath = resolve(testProjectPath, 'src', 'components')

const state = {
  config: {
    source: {
      components: componentsPath,
      data: resolve(__dirname, 'fixtures'),
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
      vhtml: {
        module: 'uiengine-adapter-vue',
        options: {}
      },
      js: {
        module: 'uiengine-adapter-vue',
        options: {}
      },
      jsx: {
        module: 'uiengine-adapter-react',
        options: {}
      },
      ejs: {
        module: 'uiengine-adapter-ejs',
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
    it('should return variant object', async () => {
      const data = await Variant.fetchById(state, 'input/text.pug')

      assert.equal(data.id, 'input/text.pug')
      assert.equal(data.title, 'Text Input')
      assert.equal(data.content, '<p>This is documentation for the text input.</p>')
      assert.equal(data.context.id, 'name')
      assert.equal(data.context.name, 'person[name]')
      assert.equal(data.extension, 'pug')
      assertMatches(data.rendered, /<input class="input input--text" id="name" name="person\[name\]" type="text"\/>/g)
      assertMatches(data.raw, /include \/input\/input\.pug/)
      assertMatches(data.raw, /\+input\(id, name\)/)
    })

    it('should infer variant title if it is not provided', async () => {
      const data = await Variant.fetchById(state, 'form/form.pug')

      assert.equal(data.title, 'Form')
    })

    it('should parse attributes with custom yaml types', async () => {
      const data = await Variant.fetchById(state, 'input/text-disabled.pug')

      assert.equal(data.included_md, '<h1 id="homepage">Homepage</h1>\n<p>Welcome!</p>')
      assert.equal(data.content_md, '<h1 id="headline">Headline</h1>\n<p>Text paragraph</p>')
      assert.equal(data.context.number, 4)
    })

    it('should omit marked parts in code', async () => {
      const data = await Variant.fetchById(state, 'form/form.pug')

      assertDoesNotMatch(data.raw, /\+input\("username", "person\[username\]"\)/g)
      assertMatches(data.raw, /\+input\("password", "person\[password\]", "Password"\)/g)
    })

    it('should omit marked parts in preview', async () => {
      const data = await Variant.fetchById(state, 'form/form.pug')

      assertDoesNotMatch(data.rendered, /<input class="input input--password" id="password" name="person\[password\]" type="password"\/>/g)
      assertMatches(data.rendered, /<input class="input input--text" id="username" name="person\[username\]" type="text"\/>/g)
    })
  })

  describe('#fetchAll', () => {
    it('should return variants object', async () => {
      const data = await Variant.fetchAll(state)
      const variantIds = Object.keys(data)

      assert.equal(variantIds.length, 17);

      [ 'input/checkbox.pug',
        'input/number.pug',
        'input/text.hbs',
        'input/text.pug',
        'input/text-disabled.pug',
        'input/text-required.pug',
        'label/label-ejs.ejs',
        'label/label-handlebars.hbs',
        'label/label-html.html',
        'label/label-vue-js.js',
        'label/label-react.jsx',
        'label/label-marko.marko',
        'label/label-pug.pug',
        'label/label-vue-sfc.vhtml',
        'formfield/text-with-label.pug',
        'formfield/text-without-label.pug',
        'form/form.pug'
      ].map(id => {
        assert(variantIds.includes(id), `missing variant "${id}"`)
      })
    })

    it('should return empty object if components source is not set', async () => {
      const data = await Variant.fetchAll({ config: { source: { } } })
      const variantIds = Object.keys(data)

      assert.equal(variantIds.length, 0)
    })
  })
})
