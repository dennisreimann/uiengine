require('mocha-sinon')()

const fs = require('fs-extra')
const { resolve } = require('path')
const assert = require('assert')
const UI = require('../src/ui')

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
  describe('#setup', () => {
    afterEach(() => { fs.removeSync(testTmpPath) })

    it('should call the UIs setup function', async function () {
      this.sinon.stub(TestUI, 'setup')
      await UI.setup(state)
      const markdownIt = require('../src/util/markdown').markdownIt
      const expectedOptions = Object.assign({}, testUiOptions, { markdownIt })

      assert(TestUI.setup.calledOnce)
      assert(TestUI.setup.calledWithMatch(expectedOptions))
    })
  })

  describe('#render', () => {
    it('should call the UIs render function with the options, state and change', async function () {
      this.sinon.stub(TestUI, 'render').returns('')
      const change = { file: 'component.md', action: 'created', type: 'component', item: 'componentId' }
      await UI.render(state, change)

      assert(TestUI.render.calledOnce)
      assert(TestUI.render.calledWithMatch(testUiOptions, state, change))
    })
  })
})
