const File = require('./util/file')
const { error } = require('./util/message')
const { debug3, debug4 } = require('./util/debug')

const getTheme = state => {
  const { config: { theme: { module } } } = state

  try {
    return require(module)
  } catch (err) {
    throw new Error(error(`Could not load "${module}" theme:`, err.stack))
  }
}

async function render (state, templateId, data = {}) {
  const { config: { theme: { options } } } = state
  const { render } = getTheme(state)
  const rendered = await render(options, templateId, data)

  return rendered
}

async function setup (state) {
  debug3(state, 'Theme.setup():start')

  const { config: { target, theme: { options } } } = state
  const { setup } = getTheme(state)
  const tasks = [copyStatic(state)]

  if (typeof setup === 'function') {
    const opts = Object.assign({}, options, { target })
    tasks.push(setup(opts))
  }

  await Promise.all(tasks)

  debug3(state, 'Theme.setup():end')
}

async function copyStatic (state) {
  debug4(state, 'Theme.copyStatic():start')

  const { config: { target } } = state
  const { staticPath } = getTheme(state)

  await File.copy(staticPath, target)

  debug4(state, 'Theme.copyStatic():end')
}

async function teardown (state) {
  debug3(state, 'Theme.teardown():start')

  const { config: { theme: { options } } } = state
  const { teardown } = getTheme(state)
  const tasks = []

  if (typeof teardown === 'function') {
    tasks.push(teardown(options))
  }

  await Promise.all(tasks)

  debug3(state, 'Theme.teardown():end')

  return state
}

module.exports = {
  setup,
  render,
  teardown
}
