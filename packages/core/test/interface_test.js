require('mocha-sinon')()

const fs = require('fs-extra')
const { resolve } = require('path')
const Interface = require('../src/interface')

const { testTmpPath } = require('../../../test/support/paths')
const target = resolve(testTmpPath, 'site')
const TestUI = require('@uiengine/ui')
const testUiOptions = { opt1: 1, opt2: 2, target }

const state = {
  config: {
    target,
    ui: testUiOptions
  }
}

describe('UI', () => {
  afterEach(function () {
    this.sinon.restore()
  })

  describe('#setup', () => {
    afterEach(() => { fs.removeSync(testTmpPath) })

    it('should call the UIs setup function', async function () {
      this.sinon.stub(TestUI, 'setup')

      await Interface.setup(state)
      const markdownIt = require('@uiengine/util/lib/markdown').markdownIt
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
      await Interface.render(state, template, data)

      this.sinon.assert.calledOnce(TestUI.render)
      this.sinon.assert.calledWithMatch(TestUI.render, testUiOptions, template, data)
    })
  })
})
