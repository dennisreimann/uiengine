const path = require('path')
const assert = require('assert')

const TemplateUtil = require('../src/util/template')
const { testProjectPath } = require('./support/paths')
const templatesPath = path.resolve(testProjectPath, 'src', 'templates')

describe('TemplateUtil', () => {
  describe('#templateFilePathToTemplateId', () => {
    it('should return template id for template file path', () => {
      const filePath = path.join(templatesPath, 'page.pug')
      assert.equal(TemplateUtil.templateFilePathToTemplateId(templatesPath, filePath), 'page')
    })

    it('should return template id for nested template file path', () => {
      const filePath = path.join(templatesPath, 'content', 'landingpage.pug')
      assert.equal(TemplateUtil.templateFilePathToTemplateId(templatesPath, filePath), 'content/landingpage')
    })

    it('should return null for non-template file path', () => {
      const configFilePath = path.resolve(testProjectPath, 'uiengine.yml')
      assert.equal(TemplateUtil.templateFilePathToTemplateId(templatesPath, configFilePath), null)
    })
  })
})
