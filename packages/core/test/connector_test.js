require('mocha-sinon')()

const assert = require('assert')
const { resolve } = require('path')

const Connector = require('../src/connector')

const { testProjectPath } = require('../../../test/support/paths')
const testAdapterPath = resolve(__dirname, 'fixtures', 'test-adapter')
const noopAdapterPath = resolve(__dirname, 'fixtures', 'noop-adapter')
const componentsPath = resolve(testProjectPath, 'src', 'components')
const testFilePath = resolve(componentsPath, 'form', 'form.test')
const testAdapterOptions = { basedir: componentsPath }
const TestAdapter = require(testAdapterPath)

const stateWithModule = module => ({
  config: {
    source: {
      components: componentsPath
    },
    adapters: {
      test: {
        module,
        options: testAdapterOptions
      }
    }
  }
})

const state = stateWithModule(testAdapterPath)
const stateNoop = stateWithModule(noopAdapterPath)

describe('Connector', () => {
  it('should throw error if the adapter cannot be resolved', async () => {
    const stateWithNonExistingAdapter = stateWithModule('doesnotexist')

    try {
      await Connector.setup(stateWithNonExistingAdapter)
    } catch (error) {
      assert(error)
    }
  })

  describe('#setup', () => {
    it('should call the adapters registerComponentFile function', async function () {
      this.sinon.stub(TestAdapter, 'registerComponentFile')
      await Connector.setup(state)

      assert(TestAdapter.registerComponentFile.calledOnce)
      assert(TestAdapter.registerComponentFile.calledWith(testAdapterOptions, testFilePath))
    })

    it('should be no op if there are no adapters', async function () {
      this.sinon.stub(TestAdapter, 'registerComponentFile')
      const state = { config: { source: { components: componentsPath }, adapters: { } } }
      await Connector.setup(state)

      assert(TestAdapter.registerComponentFile.notCalled)
    })
  })

  describe('#registerComponentFile', () => {
    it('should call the adapters registerComponentFile function', async function () {
      this.sinon.stub(TestAdapter, 'registerComponentFile')
      await Connector.registerComponentFile(state, testFilePath)

      assert(TestAdapter.registerComponentFile.calledOnce)
      assert(TestAdapter.registerComponentFile.calledWith(testAdapterOptions, testFilePath))
    })
  })

  describe('#render', () => {
    it('should call the adapter render function with the options, the template id and data', async function () {
      this.sinon.stub(TestAdapter, 'render').returns('')
      const templatePath = './src/templates/my-template.test'
      const data = { myData: 1 }
      await Connector.render(state, templatePath, data)

      assert(TestAdapter.render.calledOnce)
      assert(TestAdapter.render.calledWith(testAdapterOptions, templatePath, data))
    })

    it('should throw error if the adapter does not implement the render function', async () => {
      try {
        await Connector.render(stateNoop, './src/templates/my-template.test', {})
      } catch (error) {
        assert(error)
      }
    })

    it('should throw error if the adapter for the filetype is missing', async () => {
      try {
        await Connector.render(stateNoop, './src/templates/my-template.unknown', {})
      } catch (error) {
        assert(error)
      }
    })
  })

  describe('#filesForComponent', () => {
    it('should call the adapters filesForComponent function', async function () {
      this.sinon.stub(TestAdapter, 'filesForComponent')
      await Connector.filesForComponent(state, 'test', 'button')

      assert(TestAdapter.filesForComponent.calledOnce)
      assert(TestAdapter.filesForComponent.calledWith('button'))
    })

    it('should return an empty array if the adapter does not implement the filesForComponent function', async () => {
      const result = await Connector.filesForComponent(stateNoop, 'test', 'button')

      assert.equal(result.length, 0)
    })
  })

  describe('#filesForVariant', () => {
    it('should call the adapters filesForVariant function', async function () {
      this.sinon.stub(TestAdapter, 'filesForVariant')
      await Connector.filesForVariant(state, 'test', 'button', 'primary')

      assert(TestAdapter.filesForVariant.calledOnce)
      assert(TestAdapter.filesForVariant.calledWith('button', 'primary'))
    })

    it('should return an empty array if the adapter does not implement the filesForVariant function', async () => {
      const result = await Connector.filesForVariant(stateNoop, 'test', 'button', 'primary')

      assert.equal(result.length, 0)
    })
  })
})
