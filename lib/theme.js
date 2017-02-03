const path = require('path')
const File = require('./util/file')

const getTheme = (state) => {
  const theme = state.config.theme
  return require(theme)
}

async function render (state, templateId, data = {}) {
  const theme = getTheme(state)
  return await theme.render(templateId, data)
}

async function setup (state) {
  const theme = getTheme(state)
  const tasks = [copyAssets(state)]

  if (typeof theme.setup === 'function') {
    const markdownIt = require('./util/markdown').markdownIt
    tasks.push(theme.setup({ markdownIt }))
  }

  await Promise.all(tasks)

  return state
}

async function copyAssets (state) {
  const theme = getTheme(state)
  const sourcePath = theme.assetsPath
  const targetPath = path.resolve(state.config.target.assets)

  await File.copy(sourcePath, targetPath)

  return state
}

async function teardown (state) {
  const theme = getTheme(state)
  const tasks = []

  if (typeof theme.teardown === 'function') {
    tasks.push(theme.teardown())
  }

  await Promise.all(tasks)

  return state
}

module.exports = {
  setup,
  render,
  teardown
}

