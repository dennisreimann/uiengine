const UI = require('@uiengine/ui')
const {
  DebugUtil: { debug3 },
  MarkdownUtil: { markdownIt }
} = require('@uiengine/util')

const getOptions = (state, additional = {}) => {
  const { config: { ui, target, themes } } = state

  return Object.assign({}, ui, additional, { markdownIt, target, themes })
}

async function setup (state) {
  debug3(state, 'Interface.setup():start')

  const options = getOptions(state)
  await UI.setup(options)

  debug3(state, 'Interface.setup():end')
}

async function render (state, template, data, themeId) {
  debug3(state, `Interface.render(${template}, ${themeId}):start`)

  const options = getOptions(state, { themeId })
  const rendered = await UI.render(options, template, data)

  debug3(state, `Interface.render(${template}, ${themeId}):end`)

  return rendered
}

module.exports = {
  setup,
  render
}
