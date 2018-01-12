const markdownIt = require('./util/markdown').markdownIt
const { error } = require('./util/message')
const { debug3 } = require('./util/debug')

const getTheme = state => {
  const { config: { theme: { module } } } = state

  try {
    return require(module)
  } catch (err) {
    throw new Error(error(`Could not load "${module}" theme:`, err.stack))
  }
}

const getOptions = state => {
  const { config: { theme: { options }, target } } = state

  return Object.assign({}, options, { markdownIt, target })
}

async function setup (state) {
  debug3(state, 'Theme.setup():start')

  const { setup } = getTheme(state)

  if (typeof setup === 'function') {
    const options = getOptions(state)

    await setup(options)
  }

  debug3(state, 'Theme.setup():end')
}

async function render (state, change) {
  const { render } = getTheme(state)
  const options = getOptions(state)

  await render(options, state, change)
}

async function teardown (state) {
  debug3(state, 'Theme.teardown():start')

  const { teardown } = getTheme(state)

  if (typeof teardown === 'function') {
    const options = getOptions(state)

    await teardown(options)
  }

  debug3(state, 'Theme.teardown():end')

  return state
}

module.exports = {
  setup,
  render,
  teardown
}
