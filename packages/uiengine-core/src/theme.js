const chalk = require('chalk')
const File = require('./util/file')

const getTheme = (state) => {
  const { config: { theme: { module } } } = state

  try {
    return require(module)
  } catch (err) {
    throw new Error(chalk.red(`Could not load "${module}" theme:`) + '\n\n' + chalk.gray(err.stack))
  }
}

async function render (state, templateId, data = {}) {
  const { config: { theme: { options } } } = state
  const { render } = getTheme(state)

  return await render(options, templateId, data)
}

async function setup (state) {
  const { config: { theme: { options } } } = state
  const { setup } = getTheme(state)
  const tasks = [copyStatic(state)]

  if (typeof setup === 'function') {
    const markdownIt = require('./util/markdown').markdownIt
    const opts = Object.assign({}, options, { markdownIt })
    tasks.push(setup(opts))
  }

  await Promise.all(tasks)
}

async function copyStatic (state) {
  const { config: { target } } = state
  const { staticPath } = getTheme(state)

  await File.copy(staticPath, target)
}

async function teardown (state) {
  const { config: { theme: { options } } } = state
  const { teardown } = getTheme(state)
  const tasks = []

  if (typeof teardown === 'function') {
    tasks.push(teardown(options))
  }

  await Promise.all(tasks)

  return state
}

module.exports = {
  setup,
  render,
  teardown
}

