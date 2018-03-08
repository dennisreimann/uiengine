const assert = require('assert')

const StringUtil = require('../src/util/string')

describe('StringUtil', () => {
  describe('#titleize', () => {
    it('should return titleized string', () => {
      assert.equal(StringUtil.titleize('form'), 'Form')
      assert.equal(StringUtil.titleize('formfield-with-label'), 'Formfield With Label')
      assert.equal(StringUtil.titleize('This    is some .   text'), 'This Is Some Text')
    })
  })

  describe('#titleFromContentHeading', () => {
    it('should resolve title from content heading', () => {
      assert.equal('Atoms 1', StringUtil.titleFromContentHeading('<h1 id="atoms-1">Atoms 1</h1>'))
    })

    it('should return null if content has no heading', () => {
      assert.equal(null, StringUtil.titleFromContentHeading(''))
    })
  })

  describe('#hasContent', () => {
    it('should return true if it has a title', () => {
      assert.equal(true, StringUtil.hasContent('<h1 id="atoms">Atoms</h1>\n<p>This is content.</p>'))
    })

    it('should return false if it has only a title', () => {
      assert.equal(false, StringUtil.hasContent('<h1 id="atoms">Atoms</h1>'))
    })

    it('should return false if content is not set', () => {
      assert.equal(false, StringUtil.hasContent(null))
    })
  })

  describe('#excerptFromContent', () => {
    it('should resolve first paragraph from content', () => {
      assert.equal('<p>First paragraph</p>', StringUtil.excerptFromContent('<h1 id="atoms-1">Atoms 1</h1>\n<p>First paragraph</p>\n<p>Second paragraph</p>'))
    })

    it('should resolve first list from content', () => {
      assert.equal('<ul><li>First list item</li></ul>', StringUtil.excerptFromContent('<ul><li>First list item</li></ul>\n<p>First paragraph</p>'))
    })

    it('should return null if there is no content', () => {
      assert.equal(null, StringUtil.excerptFromContent(''))
    })
  })
})
