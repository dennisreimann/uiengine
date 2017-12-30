const path = require('path')
const R = require('ramda')
const Theme = require('./theme')
const Connector = require('./connector')
const File = require('./util/file')
const PageUtil = require('./util/page')
const { error } = require('./util/message')
const { debug2, debug3, debug4 } = require('./util/debug')

const defaultTemplateVariant = 'variant'
const pageFile = 'index.html'

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

const render = (state, templateType, templateId, data) => {
  debug4(state, `Builder.render(${templateType},${templateId}):start`)

  if (templateId) {
    const templates = state.config.templates || {}
    const template = templates[templateId]

    if (!template) {
      throw new Error(error([
        `Template "${templateId}" does not exist.`,
        'Add it to the templates source directory or refer to it like this:',
        `templates:\n  ${templateId}: PATH_RELATIVE_TO_TEMPLATES_SOURCE`
      ].join('\n\n')), [
        'Registered templates:',
        `${JSON.stringify(templates, null, '  ')}`
      ].join('\n\n'))
    }

    const rendered = Connector.render(state, template, data)

    debug4(state, `Builder.render(${templateType},${templateId}):end`)

    return rendered
  } else {
    const rendered = Theme.render(state, templateType, data)

    debug4(state, `Builder.render(${templateType},${templateId}):end`)

    return rendered
  }
}

async function renderWithFallback (state, templateType, templateId, data, identifier) {
  let html
  try {
    html = await render(state, templateType, templateId, data)
  } catch (err) {
    html = `<!DOCTYPE html><html><body><pre>${err}</pre></body></html>`
    console.error(error(`${identifier} could not be generated!`, err))
  }
  return html
}

async function dumpState (state) {
  debug2(state, 'Builder.dumpState():start')

  const json = JSON.stringify(state, null, '  ')
  const filePath = path.resolve(state.config.target, 'state.json')

  await File.write(filePath, json)

  debug2(state, 'Builder.dumpState():end')
}

async function copyPageFiles (state, pageId) {
  debug4(state, `Builder.copyPageFiles(${pageId}):start`)

  const { pages, config } = state
  const page = pages[pageId]
  const targetPagePath = PageUtil.isIndexPagePath(page.path) ? '' : page.path
  const sourcePagePath = PageUtil.pageIdToPath(page.id)
  const targetPath = path.resolve(config.target, targetPagePath)
  const sourcePath = path.resolve(config.source.pages, sourcePagePath)
  const copyFile = R.partial(copyPageFile, [targetPath, sourcePath])
  const copyFiles = R.map(copyFile, page.files)

  await Promise.all(copyFiles)

  debug4(state, `Builder.copyPageFiles(${pageId}):start`)
}

async function generatePageWithType (state, page, identifier) {
  debug3(state, `Builder.generatePageWithType(${page.id}):start`)

  const { config } = state
  const data = { state, pageId: page.id }
  const html = await renderWithFallback(state, page.type, null, data, identifier)

  if (html) {
    const targetPagePath = PageUtil.isIndexPagePath(page.path) ? '' : page.path
    const targetPath = path.resolve(config.target, targetPagePath)
    const htmlPath = path.resolve(targetPath, pageFile)

    await File.write(htmlPath, html)
  } else {
    debug4(state, `No HTML provided for page "${page.id}", skipping file creation.`)
  }

  debug3(state, `Builder.generatePageWithType(${page.id}):end`)
}

async function generatePageWithTemplate (state, page, identifier) {
  debug3(state, `Builder.generatePageWithTemplate(${page.id}):start`)

  const { config } = state
  const html = await renderWithFallback(state, null, page.template, page.context, identifier)

  if (html) {
    const targetPagePath = PageUtil.isIndexPagePath(page.path) ? '' : page.path
    const targetPath = path.resolve(config.target, targetPagePath)
    const htmlPath = path.resolve(targetPath, `_${page.template}.html`)

    await File.write(htmlPath, html)
  } else {
    debug4(state, `No HTML provided for template of page "${page.id}", skipping file creation.`)
  }

  debug3(state, `Builder.generatePageWithTemplate(${page.id}):end`)
}

async function generatePage (state, pageId) {
  debug2(state, `Builder.generatePage(${pageId}):start`)

  const { pages } = state
  const identifier = `Page "${pageId}"`
  const page = pages[pageId]
  if (!page) throw new Error(`${identifier} does not exist or has not been fetched yet.`)

  const tasks = [generatePageWithType(state, page, identifier)]
  if (page.template) tasks.push(generatePageWithTemplate(state, page, identifier))

  await Promise.all(tasks)

  debug2(state, `Builder.generatePage(${pageId}):end`)
}

async function generateComponentsForPage (state, pageId) {
  debug3(state, `Builder.generateComponentsForPage(${pageId}):start`)

  const { pages } = state
  const page = pages[pageId]
  const componentIds = page.componentIds || []
  const build = R.partial(generateComponentForPage, [state, pageId])
  const builds = R.map(build, componentIds)

  await Promise.all(builds)

  debug3(state, `Builder.generateComponentsForPage(${pageId}):end`)
}

async function generateComponentForPage (state, pageId, componentId) {
  debug4(state, `Builder.generateComponentForPage(${pageId}, ${componentId}):start`)

  const { components, pages, config: { target } } = state
  const identifier = `Component "${componentId}"`
  const parent = pages[pageId]
  const component = components[componentId]
  if (!component) throw new Error(`${identifier} does not exist or has not been fetched yet.`)

  const data = { state, pageId: PageUtil.pageIdForComponentId(pageId, componentId) }
  const html = await renderWithFallback(state, component.type, null, data, identifier)

  if (html) {
    const targetPath = path.join(target, PageUtil.pagePathForComponentId(parent.path, component.id))
    const htmlPath = path.resolve(targetPath, pageFile)

    await File.write(htmlPath, html)
  } else {
    debug4(state, `No HTML provided for component page "${component.id}", skipping file creation.`)
  }

  debug4(state, `Builder.generateComponentForPage(${pageId}, ${componentId}):end`)
}

async function generatePagesHavingComponent (state, componentId) {
  const { pages } = state
  const affectedPages = R.filter(page => (page.componentIds || []).includes(componentId), pages)
  const pageIds = Object.keys(affectedPages)
  const build = R.partial(generateComponentForPage, [state])
  const builds = R.map(pageId => build(pageId, componentId), pageIds)

  await Promise.all(builds)
}

async function generatePagesHavingTemplate (state, templateId) {
  const { pages } = state
  const affectedPages = R.filter(page => page.template === templateId, pages)
  const pageIds = Object.keys(affectedPages)
  const build = R.partial(generatePage, [state])
  const builds = R.map(build, pageIds)

  await Promise.all(builds)
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

async function generateVariant (state, variantId) {
  debug2(state, `Builder.generateVariant(${variantId}):start`)

  const { variants, config: { target } } = state
  const identifier = `Variant "${variantId}"`
  const variant = variants[variantId]
  if (!variant) throw new Error(`${identifier} does not exist or has not been fetched yet.`)

  // render variant preview, with layout
  const data = getVariantData(state, variantId)
  const templateId = variant.template || defaultTemplateVariant
  const html = await renderWithFallback(state, null, templateId, data, identifier)

  // write file
  const htmlPath = path.resolve(target, '_variants', `${variant.id}.html`)
  await File.write(htmlPath, html)

  debug2(state, `Builder.generateVariant(${variantId}):end`)
}

async function generateSite (state) {
  debug2(state, 'Builder.generateSite():start')

  const pageIds = Object.keys(state.pages)
  const variantIds = Object.keys(state.variants)

  const pageBuild = R.partial(generatePage, [state])
  const pageBuilds = R.map(pageBuild, pageIds)

  const pageFilesBuild = R.partial(copyPageFiles, [state])
  const pageFilesBuilds = R.map(pageFilesBuild, pageIds)

  const pageComponentsBuild = R.partial(generateComponentsForPage, [state])
  const pageComponentsBuilds = R.map(pageComponentsBuild, pageIds)

  const variantBuild = R.partial(generateVariant, [state])
  const variantBuilds = R.map(variantBuild, variantIds)

  await Promise.all([
    ...pageBuilds,
    ...pageFilesBuilds,
    ...pageComponentsBuilds,
    ...variantBuilds
  ])

  debug2(state, 'Builder.generateSite():end')
}

module.exports = {
  generateSite,
  generatePage,
  generateComponentForPage,
  generateComponentsForPage,
  generatePagesHavingComponent,
  generatePagesHavingTemplate,
  generateComponentVariants,
  generateVariant,
  copyPageFiles,
  dumpState
}
