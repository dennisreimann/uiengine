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
  this.timeout(8000)

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

    describe('with serve option', () => {
      it('should start the server', async () => {
        const { server } = await UIengine.build(optsWith({ serve: true, info: false }))

        assert(server)

        server.exit()
      })
    })

    describe('with watch option', () => {
      it('should start the watcher', async () => {
        const { watcher } = await UIengine.build(optsWith({ watch: true }))

        assert(watcher)

        watcher.close()
      })

      it('should report file changes', done => {
        UIengine.build(optsWith({ watch: true })).then(({ watcher }) => {
          const pagesPath = resolve(testProjectPath, 'src', 'uiengine', 'pages')
          const filePath = join(pagesPath, 'testcases', 'created', 'page.md')
          const fileDir = dirname(filePath)

          fs.mkdirsSync(fileDir)
          fs.writeFileSync(filePath, '---\ntitle: Created Page\n---\nContent for created page.')

          setTimeout(function () {
            assert(console.info.calledWithMatch('✨  Rebuilt page testcases/created'))
            watcher.close()
            fs.removeSync(fileDir)
            done()
          }, 5000)
        })
      })
    })
  })
})
