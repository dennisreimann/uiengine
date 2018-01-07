const path = require('path')
const R = require('ramda')
const Theme = require('./theme')
const Connector = require('./connector')
const File = require('./util/file')
const PageUtil = require('./util/page')
const { error } = require('./util/message')
const { debug2, debug3, debug4 } = require('./util/debug')

const defaultTemplateVariant = 'variant'

const getVariantData = ({ variants, config }, variantId) => {
  const variant = variants[variantId]
  const data = { variant, config }

  return data
}

const copyPageFile = (targetPath, sourcePath, source) => {
  const filePath = path.relative(sourcePath, source)
  const target = path.resolve(targetPath, filePath)

  return File.copy(source, target)
}

async function render (state, templateId, data, identifier) {
  debug4(state, `Builder.render(${templateId}):start`)

  const templates = state.config.templates || {}
  const template = templates[templateId]

  if (!template) {
    throw new Error(error([
      `Template "${templateId}" does not exist.`,
      'Add it to the templates source directory or refer to it like this:',
      `templates:\n  ${templateId}: PATH_RELATIVE_TO_TEMPLATES_SOURCE`
    ].join('\n\n')), [
      'Registered templates:',
      `${JSON.stringify(templates, null, 2)}`
    ].join('\n\n'))
  }

  let rendered
  try {
    rendered = await Connector.render(state, template, data)
  } catch (err) {
    rendered = `<!DOCTYPE html><html><body><pre>${err}</pre></body></html>`
    console.error(error(`${identifier} could not be generated!`, err))
  }

  debug4(state, `Builder.render(${templateId}):end`)

  return rendered
}

async function generatePageFiles (state, pageId) {
  debug4(state, `Builder.generatePageFiles(${pageId}):start`)

  const { pages, config } = state
  const page = pages[pageId]
  const targetPagePath = PageUtil.isIndexPagePath(page.path) ? '' : page.path
  const sourcePagePath = PageUtil.pageIdToPath(page.id)
  const targetPath = path.resolve(config.target, targetPagePath)
  const sourcePath = path.resolve(config.source.pages, sourcePagePath)
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
    const data = page.context
    const templateId = page.template
    const html = await render(state, templateId, data, identifier)

    // write file
    const htmlPath = path.resolve(target, '_pages', `${page.id}.html`)
    await File.write(htmlPath, html)
  }

  debug2(state, `Builder.generatePageWithTemplate(${pageId}):end`)
}

async function generatePagesWithTemplate (state, templateId) {
  debug3(state, `Builder.generatePagesWithTemplate(${templateId}):start`)

  const { pages } = state
  const affectedPages = R.filter(page => page.template === templateId, pages)
  const pageIds = Object.keys(affectedPages)
  const build = R.partial(generatePageWithTemplate, [state])
  const builds = R.map(build, pageIds)

  await Promise.all(builds)

  debug3(state, `Builder.generatePagesWithTemplate(${templateId}):end`)
}

async function generateVariant (state, variantId) {
  debug2(state, `Builder.generateVariant(${variantId}):start`)

  const { variants, config: { target } } = state
  const identifier = `Variant "${variantId}"`
  const variant = variants[variantId]
  if (!variant) throw new Error(`${identifier} does not exist or has not been fetched yet.`)

  // render variant preview, with layout
  const data = getVariantData(state, variantId)
  const templateId = variant.template || defaultTemplateVariant
  const html = await render(state, templateId, data, identifier)

  // write file
  const htmlPath = path.resolve(target, '_variants', `${variant.id}.html`)
  await File.write(htmlPath, html)

  debug2(state, `Builder.generateVariant(${variantId}):end`)
}

async function generateComponentVariants (state, componentId) {
  debug3(state, `Builder.generateComponentVariants(${componentId}):start`)

  const { components } = state
  const component = components[componentId]
  const variantIds = component.variantIds || []
  const build = R.partial(generateVariant, [state])
  const builds = R.map(build, variantIds)

  await Promise.all(builds)

  debug3(state, `Builder.generateComponentVariants(${componentId}):end`)
}

async function generateState (state, change) {
  debug2(state, 'Builder.generateState():start')

  const json = JSON.stringify(state, null, 2)
  const filePath = path.resolve(state.config.target, '_state.json')

  await Promise.all([
    File.write(filePath, json),
    Theme.render(state, change)
  ])

  debug2(state, 'Builder.generateState():end')
}

async function generate (state) {
  debug2(state, 'Builder.generate():start')

  const pageIds = Object.keys(state.pages)
  const variantIds = Object.keys(state.variants)

  const pageBuild = R.partial(generatePageWithTemplate, [state])
  const pageBuilds = R.map(pageBuild, pageIds)

  const pageFilesBuild = R.partial(generatePageFiles, [state])
  const pageFilesBuilds = R.map(pageFilesBuild, pageIds)

  const variantBuild = R.partial(generateVariant, [state])
  const variantBuilds = R.map(variantBuild, variantIds)

  await Promise.all([
    ...pageBuilds,
    ...pageFilesBuilds,
    ...variantBuilds,
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
