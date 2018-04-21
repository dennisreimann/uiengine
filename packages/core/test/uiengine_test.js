require('mocha-sinon')()

const fs = require('fs-extra')
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
    this.sinon.stub(console, 'info')
    this.sinon.stub(console, 'error')
  })

  afterEach(function () {
    fs.removeSync(testProjectTargetPath)
    this.sinon.restore()
  })

  describe('#build', () => {
    it('should generate the site', async () => {
      await UIengine.build(opts)

      assert(console.info.calledWithMatch('🚧  Building …'))
      assert(console.info.calledWithMatch('✅  Build done!'))

      assertExists(join(testProjectTargetPath, 'index.html'))
    })

    it('should not start the server and watcher', async () => {
      const { server, watcher } = await UIengine.build(opts)

      assert(!server)
      assert(!watcher)

      assertExists(join(testProjectTargetPath, 'index.html'))
    })

    describe('with no info option', () => {
      it('should not log the info output', async () => {
        await UIengine.build(optsWith({ info: false }))

        assert(!console.info.calledWithMatch('🚧  Building …'))
        assert(!console.info.calledWithMatch('✅  Build done!'))
      })

      it('should log the error output', async () => {
        try {
          await UIengine.build(optsWith({ info: false }))
        } catch (err) {
          assert(console.error.calledWithMatch('🚨  Build failed!'))
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
        this.sinon.stub(console, 'info')

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
      itFn('should report file changes', done => {
        const pagesPath = resolve(testProjectPath, 'src', 'uiengine', 'pages')
        const filePath = join(pagesPath, 'testcases', 'created', 'page.md')
        const fileDir = dirname(filePath)

        try {
          watchProcess.on('all', (changeType, changedFilePath) => {
            if (changedFilePath === filePath) {
              setTimeout(() => {
                assert(console.info.calledWithMatch('✨  Rebuilt page testcases/created'))
                fs.removeSync(fileDir)
                done()
              }, 2500)
            }
          })

          fs.mkdirsSync(fileDir)
          fs.writeFileSync(filePath, '---\ntitle: Created Page\n---\nContent for created page.')
        } catch (err) {
          fs.removeSync(fileDir)
          done(err)
        }
      })
    })
  })
})
