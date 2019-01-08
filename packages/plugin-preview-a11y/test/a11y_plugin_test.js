const { resolve } = require('path')
const assert = require('assert')
const Plugin = require('@uiengine/core/src/plugin')

const { testTmpPath } = require('../../../test/support/paths')

const state = {
  config: {
    target: testTmpPath,
    ui: {},
    plugins: [
      {
        module: resolve(__dirname, '..'),
        options: {
          title: 'A11y'
        }
      }
    ]
  }
}

describe('A11y plugin', () => {
  describe('#setup', () => {
    it('should add UI tab', async () => {
      const result = await Plugin.setup(state)
      const { tabs } = result.ui

      assert.strictEqual(tabs.length, 1)
      assert.strictEqual(tabs[0].id, 'plugin-preview-a11y')
    })
  })
})
