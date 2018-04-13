const { join, relative, resolve } = require('path')
const R = require('ramda')
const UI = require('./ui')
const Connector = require('./connector')
const File = require('./util/file')
const PageUtil = require('./util/page')
const { error } = require('./util/message')
const { debug2, debug3, debug4 } = require('./util/debug')

const replaceComment = (mark, html, content) => {
  const regexp = new RegExp(`<!--\\s?uiengine:${mark}\\s?-->`, 'gi')

  return html.replace(regexp, content)
}

const copyPageFile = (targetPath, sourcePath, source) => {
  const filePath = relative(sourcePath, source)
  const target = resolve(targetPath, filePath)

  return File.copy(source, target)
}

async function render (state, template, data, identifier) {
  debug4(state, `Builder.render(${template}):start`)

  const templatePath = join(state.config.source.templates, template)

  let rendered
  try {
    rendered = await Connector.render(state, templatePath, data)
  } catch (err) {
    const message = [error(`${identifier} could not be generated!`), err]

    if (state.config.debug) message.push(JSON.stringify(data, null, 2))

    throw new Error(message.join('\n\n'))
  }

  debug4(state, `Builder.render(${template}):end`)

  return rendered
}

async function generatePageFiles (state, pageId) {
  debug4(state, `Builder.generatePageFiles(${pageId}):start`)

  const { pages, config } = state
  const page = pages[pageId]

  if (!page.files) return

  const targetPagePath = page.path
  const sourcePagePath = PageUtil.pageIdToPath(page.id)
  const targetPath = join(config.target, targetPagePath)
  const sourcePath = join(config.source.pages, sourcePagePath)
  const copyFile = R.partial(copyPageFile, [targetPath, sourcePath])
  const copyFiles = R.map(copyFile, page.files)

  await Promise.all(copyFiles)

  debug4(state, `Builder.generatePageFiles(${pageId}):start`)
}

async function generatePageWithTemplate (state, pageId) {
  debug2(state, `Builder.generatePageWithTemplate(${pageId}):start`)

  const { pages, config: { target } } = state
  const identifier = `Page "${pageId}"`
  const page = pages[pageId]
  if (!page) throw new Error(`${identifier} does not exist or has not been fetched yet.`)

  if (page.template) {
    // render template with context
    const { id, context, template } = page
    const { rendered } = await render(state, template, context, identifier)

    // write file
    const filePath = resolve(target, '_pages', `${id}.html`)
    await File.write(filePath, rendered)
  }

  debug2(state, `Builder.generatePageWithTemplate(${pageId}):end`)
}

async function generatePagesWithTemplate (state, template) {
  debug3(state, `Builder.generatePagesWithTemplate(${template}):start`)

  const affectedPages = R.filter(page => page.template === template, state.pages)
  const pageIds = Object.keys(affectedPages)
  const build = R.partial(generatePageWithTemplate, [state])
  const builds = R.map(build, pageIds)

  await Promise.all(builds)

  debug3(state, `Builder.generatePagesWithTemplate(${template}):end`)
}

async function generateVariant (state, variant) {
  debug2(state, `Builder.generateVariant(${variant.id}):start`)

  const { config, components } = state
  const identifier = `Variant "${variant.id}"`
  const component = components[variant.componentId]

  // render variant preview, with layout
  const data = state
  const template = variant.template || config.template
  let { rendered } = await render(state, template, data, identifier)
  rendered = replaceComment('content', rendered, variant.rendered)
  rendered = replaceComment('title', rendered, `${component.title}: ${variant.title} • ${config.name} (${config.version})`)

  // write file
  const filePath = resolve(config.target, '_variants', `${variant.id}.html`)
  await File.write(filePath, rendered)

  debug2(state, `Builder.generateVariant(${variant.id}):end`)
}

async function generateComponentVariants (state, componentId) {
  debug3(state, `Builder.generateComponentVariants(${componentId}):start`)

  const component = state.components[componentId]
  const variants = component.variants || []
  const build = R.partial(generateVariant, [state])
  const builds = R.map(build, variants)

  await Promise.all(builds)

  debug3(state, `Builder.generateComponentVariants(${componentId}):end`)
}

async function generateState (state, change) {
  debug2(state, 'Builder.generateState():start')

  const tasks = [UI.render(state, change)]

  if (state.config.debug) {
    const json = JSON.stringify(state, null, 2)
    const filePath = resolve(state.config.target, '_state.json')
    const dumpState = File.write(filePath, json)

    tasks.push(dumpState)
  }

  await Promise.all(tasks)

  debug2(state, 'Builder.generateState():end')
}

async function generateSketch (state, change) {
  debug2(state, `Builder.generateSketch():start`)

  const { config } = state
  const identifier = 'HTML Sketchapp Export'

  // render variant preview, with layout
  const data = state
  const template = config.template
  const sketch = await UI.render(state, change, 'sketch')
  let { rendered } = await render(state, template, data, identifier)
  rendered = replaceComment('content', rendered, sketch)
  rendered = replaceComment('title', rendered, `HTML Sketchapp Export • ${config.name} (${config.version})`)

  // write file
  const filePath = resolve(config.target, '_sketch.html')
  await File.write(filePath, rendered)

  debug2(state, `Builder.generateSketch():end`)
}

async function generate (state) {
  debug2(state, 'Builder.generate():start')

  const pageIds = Object.keys(state.pages)
  const variants = R.reduce((list, component) => {
    return R.concat(list, component.variants)
  }, [], Object.values(state.components))

  const templateBuild = R.partial(generatePageWithTemplate, [state])
  const templateBuilds = R.map(templateBuild, pageIds)

  const fileBuild = R.partial(generatePageFiles, [state])
  const fileBuilds = R.map(fileBuild, pageIds)

  const variantBuild = R.partial(generateVariant, [state])
  const variantBuilds = R.map(variantBuild, variants)

  await Promise.all([
    ...fileBuilds,
    ...variantBuilds,
    ...templateBuilds,
    generateSketch(state),
    generateState(state)
  ])

  debug2(state, 'Builder.generate():end')
}

// generateIncrement is a better name for the public function,
// whereas generateState describes it better internally
const generateIncrement = generateState

module.exports = {
  generate,
  generateIncrement,
  generatePageWithTemplate,
  generatePagesWithTemplate,
  generateComponentVariants,
  generateVariant,
  generatePageFiles
}
