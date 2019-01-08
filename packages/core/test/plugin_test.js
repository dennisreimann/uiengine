require('mocha-sinon')()

const assert = require('assert')
const { resolve } = require('path')

const Plugin = require('../src/plugin')

const testPluginPath = resolve(__dirname, 'fixtures', 'test-plugin')
const TestPlugin = require(testPluginPath)
const testPluginOptions = {
  test: 1
}

const stateWithModule = module => ({
  config: {
    plugins: [
      {
        module,
        options: testPluginOptions
      }
    ]
  }
})

const state = stateWithModule(testPluginPath)

describe('Plugin', () => {
  afterEach(function () {
    this.sinon.restore()
  })

  it('should throw error if the plugin cannot be resolved', async () => {
    const stateWithNonExistingAdapter = stateWithModule('doesnotexist')

    try {
      await Plugin.setup(stateWithNonExistingAdapter)
    } catch (error) {
      assert(error)
    }
  })

  describe('#setup', () => {
    it('should call the plugins setup function', async function () {
      this.sinon.stub(TestPlugin, 'setup')
      await Plugin.setup(state)

      this.sinon.assert.calledOnce(TestPlugin.setup)
      this.sinon.assert.calledWith(TestPlugin.setup, testPluginOptions)
    })

    it('should be no op if there are no adapters', async function () {
      this.sinon.stub(TestPlugin, 'setup')
      const state = { config: { adapters: null } }
      await Plugin.setup(state)

      assert(TestPlugin.setup.notCalled)
    })
  })
})
