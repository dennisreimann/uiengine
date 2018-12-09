require('mocha-sinon')()

const { mkdirsSync, removeSync, writeFileSync } = require('fs-extra')
const assert = require('assert')
const { assertExists } = require('../../../test/support/asserts')
const { dirname, join, resolve } = require('path')

const UIengine = require('../src/uiengine')
const { testProjectPath, testProjectTargetPath } = require('../../../test/support/paths')

const opts = { config: resolve(testProjectPath, 'uiengine.config.js') }
const optsWith = merge => Object.assign({}, opts, merge)

const Interface = require('../src/interface')
const Connector = require('../src/connector')
const { adapters } = require('./support/adapters')

const state = {
  config: {
    source: {
      base: testProjectPath
    },
    target: testProjectTargetPath,
    themes: [
      {
        id: '_default',
        title: 'Default'
      }
    ],
    adapters
  }
}

// "end to end" tests
describe('UIengine @nowatch', function () {
  this.timeout(10000)

  before(function () {
    return Promise.all([
      Interface.setup(state),
      Connector.setup(state)
    ])
  })

  beforeEach(function () {
    this.sinon.stub(process.stdout, 'write')
    this.sinon.stub(process.stderr, 'write')
  })

  afterEach(function () {
    removeSync(testProjectTargetPath)
    this.sinon.restore()
  })

  describe('#build', function () {
    it('should generate the site', async function () {
      await UIengine.build(opts)

      this.sinon.assert.calledWithMatch(process.stdout.write, '🚧  Building …')
      this.sinon.assert.calledWithMatch(process.stdout.write, '✅  Build done!')

      assertExists(join(testProjectTargetPath, 'index.html'))
    })

    it('should not start the server and watcher', async () => {
      const { server, watcher } = await UIengine.build(opts)

      assert(!server)
      assert(!watcher)

      assertExists(join(testProjectTargetPath, 'index.html'))
    })

    describe('with no info option', () => {
      it('should not log the info output', async function () {
        await UIengine.build(optsWith({ info: false }))

        this.sinon.assert.neverCalledWithMatch(process.stdout.write, '🚧  Building …')
        this.sinon.assert.neverCalledWithMatch(process.stdout.write, '✅  Build done!')
      })

      it('should log the error output', async () => {
        try {
          await UIengine.build(optsWith({ info: false }))
        } catch (err) {
          this.sinon.assert.calledWithMatch(process.stderr.write, '🚨  Build failed!')
        }
      })
    })

    // starting the server prevents mocha from exiting.
    // this needs to be fixed before we can re-add this test.
    // describe.skip('with serve option', () => {
    //   it('should start the server', done => {
    //     UIengine.build(optsWith({ serve: true, watch: false })).then(({ server }) => {
    //       assert(server)
    //       server.emitter.on('init', () => {
    //         server.exit()
    //         done()
    //       })
    //     })
    //   })
    // })

    describe('with watch option', function () {
      it('should start the watcher and  report file changes', function (done) {
        UIengine.build(optsWith({ watch: true, serve: false })).then(({ watcher }) => {
          assert(watcher)
          assert(watcher.options.ignoreInitial)
          assert(watcher.options.awaitWriteFinish)

          const pagesPath = resolve(testProjectPath, 'uiengine', 'pages')
          const filePath = join(pagesPath, 'testcases', 'created', 'README.md')
          const fileDir = dirname(filePath)

          const cleanup = () => {
            watcher.close()
            removeSync(fileDir)
          }

          try {
            watcher.on('all', (changeType, changedFilePath) => {
              if (changedFilePath === filePath) {
                setTimeout(() => {
                  cleanup()
                  this.sinon.assert.calledWithMatch(process.stdout.write, '✨  Rebuilt page testcases/created')
                  done()
                }, 250)
              }
            })

            setTimeout(() => {
              mkdirsSync(fileDir)
              writeFileSync(filePath, '# Created Page\n\nContent for created page.')
            }, 250)
          } catch (err) {
            cleanup()
            done(err)
          }
        }).catch(done)
      })
    })
  })
})
