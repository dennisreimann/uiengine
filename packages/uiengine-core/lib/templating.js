const R = require('ramda')

const getTemplating = (state) => {
  const templating = state.config.templating
  return require(templating)
}

async function renderTemplate (state, templateId, data = {}, opts = {}) {
  const templating = getTemplating(state)
  const { components, templates } = state.config.source

  opts = R.assoc('templatesPath', templates, opts)
  opts = R.assoc('componentsPath', components, opts)

  const rendered = await templating.renderTemplate(templateId, data, opts)

  return rendered
}

async function renderString (state, templateString, data = {}, opts = {}) {
  const templating = getTemplating(state)
  const { components, templates } = state.config.source

  opts = R.assoc('templatesPath', templates, opts)
  opts = R.assoc('componentsPath', components, opts)

  const rendered = await templating.renderString(templateString, data, opts)

  return rendered
}

async function setup (state) {
  const templating = getTemplating(state)
  const tasks = []

  if (typeof templating.setup === 'function') {
    tasks.push(templating.setup())
  }

  await Promise.all(tasks)

  return state
}

async function teardown (state) {
  const templating = getTemplating(state)
  const tasks = []

  if (typeof templating.teardown === 'function') {
    tasks.push(templating.teardown())
  }

  await Promise.all(tasks)

  return state
}

module.exports = {
  setup,
  renderTemplate,
  renderString,
  teardown
}

