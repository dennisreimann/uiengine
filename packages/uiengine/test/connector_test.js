require('mocha-sinon')()

const path = require('path')
const assert = require('assert')
const Connector = require('../src/connector')

const { testProjectPath } = require('./support/paths')
const testAdapterPath = path.resolve(__dirname, 'fixtures', 'test-adapter')
const noopAdapterPath = path.resolve(__dirname, 'fixtures', 'noop-adapter')
const componentsPath = path.resolve(testProjectPath, 'src', 'components')
const testFilePath = path.resolve(componentsPath, 'form', 'form.test')
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
  it('should throw error if the adapter cannot be resolved', done => {
    const stateWithNonExistingAdapter = stateWithModule('doesnotexist')

    Connector.setup(stateWithNonExistingAdapter)
      .catch(error => {
        assert(error)
        done()
      })
  })

  describe('#setup', () => {
    it('should call the adapters registerComponentFile function', function (done) {
      this.sinon.stub(TestAdapter, 'registerComponentFile')

      Connector.setup(state)
        .then(() => {
          assert(TestAdapter.registerComponentFile.calledOnce)
          assert(TestAdapter.registerComponentFile.calledWith(testAdapterOptions, testFilePath))

          done()
        })
        .catch(done)
    })

    it('should be no op if there are no adapters', function (done) {
      this.sinon.stub(TestAdapter, 'registerComponentFile')

      const state = { config: { source: { components: componentsPath }, adapters: { } } }

      Connector.setup(state)
        .then(() => {
          assert(TestAdapter.registerComponentFile.notCalled)

          done()
        })
        .catch(done)
    })
  })

  describe('#registerComponentFile', () => {
    it('should call the adapters registerComponentFile function', function (done) {
      this.sinon.stub(TestAdapter, 'registerComponentFile')

      Connector.registerComponentFile(state, testFilePath)
        .then(() => {
          assert(TestAdapter.registerComponentFile.calledOnce)
          assert(TestAdapter.registerComponentFile.calledWith(testAdapterOptions, testFilePath))

          done()
        })
        .catch(done)
    })
  })

  describe('#render', () => {
    it('should call the adapter render function with the options, the template id and data', function (done) {
      this.sinon.stub(TestAdapter, 'render').returns('')

      const templatePath = './src/templates/my-template.test'
      const data = { myData: 1 }

      Connector.render(state, templatePath, data)
        .then(() => {
          assert(TestAdapter.render.calledOnce)
          assert(TestAdapter.render.calledWith(testAdapterOptions, templatePath, data))

          done()
        })
        .catch(done)
    })

    it('should throw error if the adapter does not implement the render function', done => {
      Connector.render(stateNoop, './src/templates/my-template.test', {})
        .catch(error => {
          assert(error)
          done()
        })
    })
  })

  describe('#filesForComponent', () => {
    it('should call the adapters filesForComponent function', function (done) {
      this.sinon.stub(TestAdapter, 'filesForComponent')

      Connector.filesForComponent(state, 'test', 'button')
        .then(() => {
          assert(TestAdapter.filesForComponent.calledOnce)
          assert(TestAdapter.filesForComponent.calledWith('button'))

          done()
        })
        .catch(done)
    })

    it('should return an empty array if the adapter does not implement the filesForComponent function', done => {
      Connector.filesForComponent(stateNoop, 'test', 'button')
        .then(result => {
          assert.equal(result.length, 0)

          done()
        })
        .catch(done)
    })
  })

  describe('#filesForVariant', () => {
    it('should call the adapters filesForVariant function', function (done) {
      this.sinon.stub(TestAdapter, 'filesForVariant')

      Connector.filesForVariant(state, 'test', 'button', 'primary')
        .then(() => {
          assert(TestAdapter.filesForVariant.calledOnce)
          assert(TestAdapter.filesForVariant.calledWith('button', 'primary'))

          done()
        })
        .catch(done)
    })

    it('should return an empty array if the adapter does not implement the filesForVariant function', done => {
      Connector.filesForVariant(stateNoop, 'test', 'button', 'primary')
        .then(result => {
          assert.equal(result.length, 0)

          done()
        })
        .catch(done)
    })
  })
})
