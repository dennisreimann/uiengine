require('mocha-sinon')()

const { removeSync } = require('fs-extra')
const { resolve } = require('path')
const Interface = require('../src/interface')

const { testProjectTargetPath } = require('../../../test/support/paths')
const target = resolve(testProjectTargetPath, 'site')
const TestUI = require('@uiengine/ui')
const themeId = '_default'
const testUiOptions = { opt1: 1, opt2: 2, target, themeId }

const state = {
  config: {
    target,
    ui: testUiOptions
  }
}

describe('Interface', () => {
  afterEach(function () {
    this.sinon.restore()
  })

  describe('#setup', () => {
    afterEach(() => { removeSync(testProjectTargetPath) })

    it('should call the UIs setup function', async function () {
      this.sinon.stub(TestUI, 'setup')

      await Interface.setup(state)
      const { MarkdownUtil } = require('@uiengine/util')
      const { markdownIt } = MarkdownUtil
      const expectedOptions = Object.assign({}, testUiOptions, { markdownIt })

      this.sinon.assert.calledOnce(TestUI.setup)
      this.sinon.assert.calledWithMatch(TestUI.setup, expectedOptions)
    })
  })

  describe('#render', () => {
    it('should call the UIs render function with the options and state', async function () {
      this.sinon.stub(TestUI, 'render').returns('')
      const template = 'testtemplate'
      const data = { test: 1 }
      await Interface.render(state, template, data, themeId)

      this.sinon.assert.calledOnce(TestUI.render)
      this.sinon.assert.calledWithMatch(TestUI.render, testUiOptions, template, data)
    })
  })
})
