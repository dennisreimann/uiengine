require('mocha-sinon')()

const assert = require('assert')
const { assertMatches } = require('../../../test/support/asserts')
const { decorateContext, decorateCode, omit } = require('../src/shared/code')
const localize = require('../src/shared/localize')

describe('Shared', () => {
  describe('#omit', () => {
    it('should not remove the rendered title from content if it does not match the page title', () => {
      const content = omit('code', 'before <!-- omit:code:start --> left out <!-- omit:code:end --> after')

      assert.strictEqual(content, 'before after')
    })
  })

  describe('#decorateCode', () => {
    it('should return the highlighted raw code', () => {
      const decorated = decorateCode('.className { color: blue; }')

      assertMatches(decorated, '<pre class="hljs" lang="css"><code><span class="hljs-selector-class">.className</span> { <span class="hljs-attribute">color</span>: blue; }</code></pre>')
    })

    it('should return the highlighted rendered html', () => {
      const decorated = decorateCode('<h1>Title</h1>', 'html')

      assertMatches(decorated, '<pre class="hljs" lang="html"><code><span class="hljs-tag">&lt;<span class="hljs-name">h1</span>&gt;</span>Title<span class="hljs-tag">&lt;/<span class="hljs-name">h1</span>&gt;</span></code></pre>')
    })
  })

  describe('#decorateContext', () => {
    it('should return the highlighted and pretty-printed json', () => {
      const decorated = decorateContext({ data: true })

      assertMatches(decorated, '<pre class="hljs" lang="json"><code>{\n  <span class="hljs-attr">"data"</span>: <span class="hljs-literal">true</span>\n}</code></pre>')
    })
  })

  describe('#localize', () => {
    it('should return the localized string', () => {
      assert.strictEqual(localize({ key: 'Test' }, 'key'), 'Test')
      assert.strictEqual(localize({ key: { nested: 'Nested Test' } }, 'key.nested'), 'Nested Test')
    })

    it('should return the localized string with interpolations', () => {
      assert.strictEqual(localize({ search: 'Search results for "%{query}"' }, 'search', { query: 'Test' }), 'Search results for "Test"')
      assert.strictEqual(localize({ search: { query: 'Search results for "%{query}"' } }, 'search.query', { query: 'Nested' }), 'Search results for "Nested"')
    })

    it('should return the key and print a warning if there is no localized string', function () {
      this.sinon.stub(console, 'warn')

      assert.strictEqual(localize({}, 'doesnotexist'), '[doesnotexist]')
      this.sinon.assert.calledWith(console.warn, '[UIengine]', 'Missing localization for key "doesnotexist"!')

      assert.strictEqual(localize({}, 'doesnotexist.nested'), '[doesnotexist.nested]')
      this.sinon.assert.calledWith(console.warn, '[UIengine]', 'Missing localization for key "doesnotexist.nested"!')

      this.sinon.restore()
    })

    it('should return the key and print a warning if there is a missing interpolation', function () {
      this.sinon.stub(console, 'warn')

      assert.strictEqual(localize({ search: 'Search results for "%{query}"' }, 'search', {}), 'Search results for "[query]"')
      this.sinon.assert.calledWith(console.warn, '[UIengine]', 'Missing interpolation "query" for key "search"!')

      this.sinon.restore()
    })
  })
})
