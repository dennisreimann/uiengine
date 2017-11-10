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
})
