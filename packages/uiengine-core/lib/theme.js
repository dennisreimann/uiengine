const path = require('path')
const File = require('./util/file')

const getTheme = (state) => {
  const themePath = path.resolve(process.cwd(), state.config.basedirs.theme)
  const Theme = require(themePath)

  return Theme
}

async function render (state, templateId, data = {}) {
  const Theme = getTheme(state)
  const rendered = await Theme.render(templateId, data)

  return rendered
}

async function setup (state) {
  const Theme = getTheme(state)
  const setupTheme = Theme.setup()
  const setupAssets = copyAssets(state)

  await Promise.all([setupTheme, setupAssets])

  return state
}

async function copyAssets (state) {
  const Theme = getTheme(state)
  const sourcePath = Theme.assetsPath
  const targetPath = path.resolve(state.config.target.assets)

  await File.copy(sourcePath, targetPath)

  return state
}

async function teardown (state) {
  const Theme = getTheme(state)

  return await Theme.teardown()
}

module.exports = {
  setup,
  render,
  teardown
}

