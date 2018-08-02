const UI = require('@uiengine/ui')
const {
  DebugUtil: { debug3 },
  MarkdownUtil: { markdownIt }
} = require('@uiengine/util')

const getOptions = state => {
  const { config: { ui, target } } = state

  return Object.assign({}, ui, { markdownIt, target })
}

export async function setup (state) {
  debug3(state, 'UI.setup():start')

  const options = getOptions(state)
  await UI.setup(options)

  debug3(state, 'UI.setup():end')
}

export async function render (state, template, data) {
  debug3(state, 'UI.render():start')

  const options = getOptions(state)
  const rendered = await UI.render(options, template, data)

  debug3(state, 'UI.render():end')

  return rendered
}
