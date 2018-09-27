require('mocha-sinon')()

const { mkdirsSync, removeSync, writeFileSync } = require('fs-extra')
const assert = require('assert')
const { assertExists } = require('../../../test/support/asserts')
const { dirname, join, resolve } = require('path')

const UIengine = require('../src/uiengine')
const { testProjectPath, testProjectTargetPath } = require('../../../test/support/paths')

const opts = { config: resolve(testProjectPath, 'uiengine.config.js') }
const optsWith = merge => Object.assign({}, opts, merge)

// "end to end" tests
describe('UIengine', function () {
  this.timeout(5000)

  beforeEach(function () {
    this.sinon.stub(process.stdout, 'write')
    this.sinon.stub(process.stderr, 'write')
  })

  afterEach(function () {
    removeSync(testProjectTargetPath)
    this.sinon.restore()
  })

  describe('#build', () => {
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
    // this needs to be fixed before we can readd this test.
    describe.skip('with serve option', () => {
      it('should start the server', done => {
        UIengine.build(optsWith({ serve: true, watch: false })).then(({ server }) => {
          assert(server)

          server.emitter.on('init', () => {
            server.exit()
            done()
          })
        })
      })
    })

    describe('with watch option', function () {
      this.timeout(10000)

      let watchProcess

      before(function (done) {
        // suppress output during tests
        this.sinon.stub(process.stdout, 'write')

        UIengine.build(optsWith({ watch: true, serve: false })).then(({ watcher }) => {
          watchProcess = watcher
          done()
        })
      })

      after(function () {
        this.sinon.restore()

        watchProcess.close()
      })

      it('should start the watcher', () => {
        assert(watchProcess)
        assert(watchProcess.options.ignoreInitial)
        assert(watchProcess.options.awaitWriteFinish)
      })

      // skip this test on CI as file watching does not seem to work in this environment
      const itFn = process.env.CI === 'true' ? it.skip : it
      itFn('should report file changes', function (done) {
        const pagesPath = resolve(testProjectPath, 'uiengine', 'pages')
        const filePath = join(pagesPath, 'testcases', 'created', 'page.md')
        const fileDir = dirname(filePath)

        try {
          watchProcess.on('all', (changeType, changedFilePath) => {
            if (changedFilePath === filePath) {
              setTimeout(() => {
                removeSync(fileDir)
                this.sinon.assert.calledWithMatch(process.stdout.write, '✨  Rebuilt page testcases/created')
                done()
              }, 2500)
            }
          })

          mkdirsSync(fileDir)
          writeFileSync(filePath, '---\ntitle: Created Page\n---\nContent for created page.')
        } catch (err) {
          removeSync(fileDir)
          done(err)
        }
      })
    })
  })
})
