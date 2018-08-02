require('mocha-sinon')()

const { reportSuccess, reportInfo, reportError } = require('../src/message')
const { UiengineInputError } = require('../src/error')

describe('MessageUtil', () => {
  beforeEach(function () {
    this.sinon.stub(process.stdout, 'write')
    this.sinon.stub(process.stderr, 'write')
  })

  afterEach(function () {
    this.sinon.restore()
  })

  describe('#reportSuccess', () => {
    it('should write to stdout, prefixed with success icon', function () {
      reportSuccess('Yay!')

      this.sinon.assert.calledWithMatch(process.stdout.write, '✅  Yay!')
    })
  })

  describe('#reportInfo', () => {
    it('should write to stdout, prefixed with info icon', function () {
      reportInfo('You should know about this.')

      this.sinon.assert.calledWithMatch(process.stdout.write, 'ℹ️  You should know about this.')
    })

    describe('with message array', () => {
      it('should concatenate the messages with two newlines', function () {
        reportInfo(['This is', 'a lengthy', 'message'])

        this.sinon.assert.calledWithMatch(process.stdout.write, 'This is\n\na lengthy\n\nmessage')
      })
    })

    describe('with icon option', () => {
      it('should prefix the message with the custom icon', function () {
        reportInfo('Flying to the moon', { icon: '🚀' })

        this.sinon.assert.calledWithMatch(process.stdout.write, '🚀  Flying to the moon')
      })
    })

    describe('with transient option', () => {
      it('should postfix the message with a cursor reset', function () {
        reportInfo('Nothing is forever.', { transient: true })

        this.sinon.assert.calledWithMatch(process.stdout.write, 'Nothing is forever.\r')
      })
    })
  })

  describe('#reportError', () => {
    it('should write to stderr, prefixed with error icon', function () {
      reportError('Something bad happened!')

      // split the asserts to prevent the coloring to lead to non-match
      this.sinon.assert.calledWithMatch(process.stderr.write, '🚨  ')
      this.sinon.assert.calledWithMatch(process.stderr.write, 'Something bad happened!')
    })

    describe('with error', () => {
      it('should concatenate the messages with two newlines', function () {
        const error = new Error('And it is really bad!')
        reportError('Something bad happened!', error)

        this.sinon.assert.calledWithMatch(process.stderr.write, 'Error: And it is really bad!')
        this.sinon.assert.calledWithMatch(process.stderr.write, 'at Context')
      })

      describe('of type UiengineInputError', () => {
        it('should not append a stacktrace', function () {
          const error = new UiengineInputError('It is an input error!')
          reportError('Something bad happened!', error)

          this.sinon.assert.calledWithMatch(process.stderr.write, 'It is an input error!')
          this.sinon.assert.neverCalledWithMatch(process.stderr.write, 'at Context')
        })
      })
    })
  })
})
