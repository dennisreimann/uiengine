const assert = require('assert')
const { join, resolve } = require('path')

const TemplateUtil = require('../src/template')
const { testProjectPath } = require('../../../test/support/paths')
const templatesPath = resolve(testProjectPath, 'src', 'templates')

describe('TemplateUtil', () => {
  describe('#templateFilePathToTemplateId', () => {
    it('should return template id for template file path', () => {
      const filePath = join(templatesPath, 'page.pug')
      assert.strictEqual(TemplateUtil.templateFilePathToTemplateId(templatesPath, filePath), 'page.pug')
    })

    it('should return template id for nested template file path', () => {
      const filePath = join(templatesPath, 'content', 'landingpage.pug')
      assert.strictEqual(TemplateUtil.templateFilePathToTemplateId(templatesPath, filePath), 'content/landingpage.pug')
    })

    it('should return null for non-template file path', () => {
      const configFilePath = resolve(testProjectPath, 'uiengine.config.js')
      assert.strictEqual(TemplateUtil.templateFilePathToTemplateId(templatesPath, configFilePath), null)
    })
  })
})
