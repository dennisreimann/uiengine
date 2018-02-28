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
})
