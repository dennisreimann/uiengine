require('mocha-sinon')()

const { debug, debug2, debug3, debug4, debug5 } = require('../src/util/debug')

const stateWithDebugLevel = debug => ({ config: { debug } })
const state1 = stateWithDebugLevel(1)
const state2 = stateWithDebugLevel(2)
const state3 = stateWithDebugLevel(3)
const state4 = stateWithDebugLevel(4)
const state5 = stateWithDebugLevel(5)

describe('Debug', () => {
  afterEach(function () {
    this.sinon.restore()
  })

  describe('statements', () => {
    it('should be printed according to the configured level', function () {
      this.sinon.stub(console, 'info')

      debug(state1, 'debug(1)')
      debug(state2, 'debug(2)')
      debug(state3, 'debug(3)')
      debug(state4, 'debug(4)')
      debug(state5, 'debug(5)')
      this.sinon.assert.calledWithMatch(console.info, 'debug(1)')
      this.sinon.assert.calledWithMatch(console.info, 'debug(2)')
      this.sinon.assert.calledWithMatch(console.info, 'debug(3)')
      this.sinon.assert.calledWithMatch(console.info, 'debug(4)')
      this.sinon.assert.calledWithMatch(console.info, 'debug(5)')

      debug2(state1, 'debug2(1)')
      debug2(state2, 'debug2(2)')
      debug2(state3, 'debug2(3)')
      debug2(state4, 'debug2(4)')
      debug2(state5, 'debug2(5)')
      this.sinon.assert.neverCalledWithMatch(console.info, 'debug2(1)')
      this.sinon.assert.calledWithMatch(console.info, 'debug2(2)')
      this.sinon.assert.calledWithMatch(console.info, 'debug2(3)')
      this.sinon.assert.calledWithMatch(console.info, 'debug2(4)')
      this.sinon.assert.calledWithMatch(console.info, 'debug2(5)')

      debug3(state1, 'debug3(1)')
      debug3(state2, 'debug3(2)')
      debug3(state3, 'debug3(3)')
      debug3(state4, 'debug3(4)')
      debug3(state5, 'debug3(5)')
      this.sinon.assert.neverCalledWithMatch(console.info, 'debug3(1)')
      this.sinon.assert.neverCalledWithMatch(console.info, 'debug3(2)')
      this.sinon.assert.calledWithMatch(console.info, 'debug2(3)')
      this.sinon.assert.calledWithMatch(console.info, 'debug2(4)')
      this.sinon.assert.calledWithMatch(console.info, 'debug2(5)')

      debug4(state1, 'debug4(1)')
      debug4(state2, 'debug4(2)')
      debug4(state3, 'debug4(3)')
      debug4(state4, 'debug4(4)')
      debug4(state5, 'debug4(5)')
      this.sinon.assert.neverCalledWithMatch(console.info, 'debug4(1)')
      this.sinon.assert.neverCalledWithMatch(console.info, 'debug4(2)')
      this.sinon.assert.neverCalledWithMatch(console.info, 'debug4(3)')
      this.sinon.assert.calledWithMatch(console.info, 'debug4(4)')
      this.sinon.assert.calledWithMatch(console.info, 'debug4(5)')

      debug5(state1, 'debug5(1)')
      debug5(state2, 'debug5(2)')
      debug5(state3, 'debug5(3)')
      debug5(state4, 'debug5(4)')
      debug5(state5, 'debug5(5)')
      this.sinon.assert.neverCalledWithMatch(console.info, 'debug5(1)')
      this.sinon.assert.neverCalledWithMatch(console.info, 'debug5(2)')
      this.sinon.assert.neverCalledWithMatch(console.info, 'debug5(3)')
      this.sinon.assert.neverCalledWithMatch(console.info, 'debug5(4)')
      this.sinon.assert.calledWithMatch(console.info, 'debug2(5)')
    })

    it('should allow for multiple arguments', function () {
      this.sinon.stub(console, 'info')

      debug(state1, 'debug', '1', '2', '3')
      this.sinon.assert.calledWithMatch(console.info, 'debug')
      this.sinon.assert.calledWithMatch(console.info, '1')
      this.sinon.assert.calledWithMatch(console.info, '2')
      this.sinon.assert.calledWithMatch(console.info, '3')
    })
  })

  describe('timings', () => {
    it('should be recorded', function () {
      this.sinon.stub(console, 'time')
      this.sinon.stub(console, 'timeEnd')

      debug(state1, 'debug():start')
      this.sinon.assert.calledWithMatch(console.time, 'debug()')

      debug(state1, 'debug():end')
      this.sinon.assert.calledWithMatch(console.timeEnd, 'debug()')
    })
  })
})
