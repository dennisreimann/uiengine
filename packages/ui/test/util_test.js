const assert = require('assert')
const { assertMatches } = require('../../../test/support/asserts')
const Util = require('../src/util')

describe('Util', () => {
  describe('#upcaseFirstChar', () => {
    it('should convert the first character of the string to uppercase', () => {
      assert.equal(Util.upcaseFirstChar('test'), 'Test')
    })

    it('should not convert other characters to uppercase', () => {
      assert.equal(Util.upcaseFirstChar('test test test'), 'Test test test')
    })
  })

  describe('#dasherize', () => {
    it('should convert non-word character to dashes', () => {
      assert.equal(Util.dasherize('this is a test. does/it.work?'), 'this-is-a-test-does-it-work-')
    })
  })

  describe('#titleize', () => {
    it('should return titleized string', () => {
      assert.equal(Util.titleize('form'), 'Form')
      assert.equal(Util.titleize('formfield-with-label'), 'Formfield With Label')
      assert.equal(Util.titleize('This    is some .   text'), 'This Is Some Text')
    })
  })

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

      assertMatches(decorated, '<pre class="hljs" lang="css"><span class="hljs-selector-class">.className</span> { <span class="hljs-attribute">color</span>: blue; }</pre>')
    })

    it('should return the highlighted rendered html', () => {
      const decorated = Util.decorateCode('<h1>Title</h1>', 'html')

      assertMatches(decorated, '<pre class="hljs" lang="html"><span class="hljs-tag">&lt;<span class="hljs-name">h1</span>&gt;</span>Title<span class="hljs-tag">&lt;/<span class="hljs-name">h1</span>&gt;</span></pre>')
    })
  })

  describe('#decorateContext', () => {
    it('should return the highlighted and pretty-printed json', () => {
      const decorated = Util.decorateContext({ data: true })

      assertMatches(decorated, '<pre class="hljs" lang="json">{\n  <span class="hljs-attr">"data"</span>: <span class="hljs-literal">true</span>\n}</pre>')
    })
  })
})
