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
          title: 'Toggle Grid',
          icon: 'grid',
          selector: 'body',
          className: 'show-grid'
        }
      }
    ]
  }
}

describe('Toggle class plugin', () => {
  describe('#setup', () => {
    it('should add UI action', async () => {
      const result = await Plugin.setup(state)
      const { actions } = result.ui

      assert.strictEqual(actions.length, 1)
      assert.strictEqual(actions[0].id, 'plugin-preview-toggle-class')
    })
  })
})
