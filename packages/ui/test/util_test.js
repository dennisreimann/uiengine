require('mocha-sinon')()

const assert = require('assert')
const { assertMatches } = require('../../../test/support/asserts')
const Util = require('../src/util')

describe('Util', () => {
  describe('#decorateContent', () => {
    it('should remove the rendered title from content if it matches the page title', () => {
      const page = {
        title: 'The page title',
        content: '<h1>The page title</h1>\n<p>This is the page content.</p>'
      }

      const content = Util.decorateContent(page)

      assert.equal(content, '<p>This is the page content.</p>')
    })

    it('should not remove the rendered title from content if it does not match the page title', () => {
      const page = {
        title: 'Another page title',
        content: '<h1>The page title</h1>\n<p>This is the page content.</p>'
      }

      const content = Util.decorateContent(page)

      assert.equal(content, '<h1>The page title</h1>\n<p>This is the page content.</p>')
    })
  })

  describe('#decorateCode', () => {
    it('should return the highlighted raw code', () => {
      const decorated = Util.decorateCode('.className { color: blue; }')

      assertMatches(decorated, '<pre class="hljs" lang="css"><code><span class="hljs-selector-class">.className</span> { <span class="hljs-attribute">color</span>: blue; }</code></pre>')
    })

    it('should return the highlighted rendered html', () => {
      const decorated = Util.decorateCode('<h1>Title</h1>', 'html')

      assertMatches(decorated, '<pre class="hljs" lang="html"><code><span class="hljs-tag">&lt;<span class="hljs-name">h1</span>&gt;</span>Title<span class="hljs-tag">&lt;/<span class="hljs-name">h1</span>&gt;</span></code></pre>')
    })
  })

  describe('#decorateContext', () => {
    it('should return the highlighted and pretty-printed json', () => {
      const decorated = Util.decorateContext({ data: true })

      assertMatches(decorated, '<pre class="hljs" lang="json"><code>{\n  <span class="hljs-attr">"data"</span>: <span class="hljs-literal">true</span>\n}</code></pre>')
    })
  })

  describe('#localize', () => {
    it('should return the localized string', () => {
      assert.equal(Util.localize({ key: 'Test' }, 'key'), 'Test')
      assert.equal(Util.localize({ key: { nested: 'Nested Test' } }, 'key.nested'), 'Nested Test')
    })

    it('should return the localized string with interpolations', () => {
      assert.equal(Util.localize({ search: 'Search results for "%{query}"' }, 'search', { query: 'Test' }), 'Search results for "Test"')
      assert.equal(Util.localize({ search: { query: 'Search results for "%{query}"' } }, 'search.query', { query: 'Nested' }), 'Search results for "Nested"')
    })

    it('should return the key and print a warning if there is no localized string', function () {
      this.sinon.stub(console, 'warn')

      assert.equal(Util.localize({}, 'doesnotexist'), '[doesnotexist]')
      this.sinon.assert.calledWith(console.warn, '[UIengine]', 'Missing localization for key "doesnotexist"!')

      assert.equal(Util.localize({}, 'doesnotexist.nested'), '[doesnotexist.nested]')
      this.sinon.assert.calledWith(console.warn, '[UIengine]', 'Missing localization for key "doesnotexist.nested"!')

      this.sinon.restore()
    })

    it('should return the key and print a warning if there is a missing interpolation', function () {
      this.sinon.stub(console, 'warn')

      assert.equal(Util.localize({ search: 'Search results for "%{query}"' }, 'search', {}), 'Search results for "[query]"')
      this.sinon.assert.calledWith(console.warn, '[UIengine]', 'Missing interpolation "query" for key "search"!')

      this.sinon.restore()
    })
  })
})
