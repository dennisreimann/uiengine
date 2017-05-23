const path = require('path')
const R = require('ramda')
const chalk = require('chalk')
const Theme = require('./theme')
const Connector = require('./connector')
const File = require('./util/file')
const PageUtil = require('./util/page')
const { debug2, debug3, debug4 } = require('./util/debug')
const NavigationData = require('./data/navigation')

// Theme templates need to be prefixed with "theme:" to be referenced
// as an alternative page template. This might be the case for certain
// pages like the homepage or sandbox overview.
// The variant template default does not have this prefix, because
// by definition it must be an application template of the project.
const themeTemplatePrefix = 'theme:'
const defaultTemplatePage = themeTemplatePrefix + 'page'
const defaultTemplateComponent = themeTemplatePrefix + 'component'
const defaultTemplateSchema = themeTemplatePrefix + 'schema'
const defaultTemplateVariant = 'variant'
const pageFile = 'index.html'

const isThemeTemplate = templateId =>
  !templateId || templateId.startsWith(themeTemplatePrefix)

const getPageData = ({ pages, navigation, config }, pageId) => {
  const page = pages[pageId]

  if (isThemeTemplate(page.template)) {
    return { page, pages, navigation, config }
  } else {
    return page.context || {}
  }
}

const getComponentData = ({ pages, navigation, components, schema, variants, config }, pageId, componentId) => {
  const parent = pages[pageId]
  const component = components[componentId]
  const page = {
    id: PageUtil.pageIdForComponentId(parent.id, component.id),
    path: PageUtil.pagePathForComponentId(parent.path, component.id),
    title: component.title,
    content: component.content,
    childIds: [],
    files: []
  }

  const data = { page, pages, component, components, schema, variants, navigation, config }

  return data
}

const getVariantData = ({ variants, config }, variantId) => {
  const variant = variants[variantId]
  const data = { variant, config }

  return data
}

const getSchemaData = ({ schema, pages, navigation, config }) => {
  const parentId = PageUtil.INDEX_ID
  const childIds = []
  const page = {
    id: 'schema',
    path: '_schema',
    title: 'Schema',
    childIds: [],
    files: []
  }

  // the schema page is standalone and does not appear in the regular navigation.
  // nevertheless it needs an own navigation item on its own page, which gets attached here.
  navigation.schema = NavigationData(page.id, page.title, page.path, childIds, parentId, { parentIds: [parentId] })

  const data = { page, pages, schema, navigation, config }

  return data
}

const copyPageFile = (targetPath, sourcePath, source) => {
  const filePath = path.relative(sourcePath, source)
  const target = path.resolve(targetPath, filePath)

  return File.copy(source, target)
}

const render = (state, templateId, data) => {
  debug4(state, `Builder.render(${templateId}):start`)

  if (isThemeTemplate(templateId)) {
    const template = templateId.substring(themeTemplatePrefix.length)
    const rendered = Theme.render(state, template, data)

    debug4(state, `Builder.render(${templateId}):end`)

    return rendered
  } else {
    const templates = state.config.templates || {}
    const template = templates[templateId]

    if (!template) {
      throw new Error(chalk.red([
        `Template "${templateId}" does not exist.`,
        'In case you want to reference an existing theme template,\nplease prefix it with "theme:" – i.e. "theme:page".',
        'If this is supposed to be a custom template, add it to the\ntemplates source directory or refer to it like this:',
        `templates:\n  ${templateId}: PATH_RELATIVE_TO_TEMPLATES_SOURCE`
      ].join('\n\n')) + chalk.gray([
        'Registered templates:',
        `${JSON.stringify(templates, null, '  ')}`
      ].join('\n\n')))
    }

    const rendered = Connector.render(state, template, data)

    debug4(state, `Builder.render(${templateId}):end`)

    return rendered
  }
}

async function renderWithFallback (state, templateId, data, identifier) {
  let html
  try {
    html = await render(state, templateId, data)
  } catch (err) {
    html = `<!DOCTYPE html><html><body><pre>${err}</pre></body></html>`
    console.error(chalk.red(`${identifier} could not be generated!`) + '\n\n' + chalk.gray(err))
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

async function generatePage (state, pageId) {
  debug2(state, `Builder.generatePage(${pageId}):start`)

  const { pages, config } = state
  const identifier = `Page "${pageId}"`
  const page = pages[pageId]
  if (!page) throw new Error(`${identifier} does not exist or has not been fetched yet.`)

  const data = getPageData(state, pageId)
  const templateId = page.template || defaultTemplatePage
  const html = await renderWithFallback(state, templateId, data, identifier)

  const targetPagePath = PageUtil.isIndexPagePath(page.path) ? '' : page.path
  const targetPath = path.resolve(config.target, targetPagePath)
  const htmlPath = path.resolve(targetPath, pageFile)

  await File.write(htmlPath, html)

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

  const data = getComponentData(state, pageId, componentId)
  const templateId = component.template || defaultTemplateComponent
  const html = await renderWithFallback(state, templateId, data, identifier)

  const targetPath = path.join(target, PageUtil.pagePathForComponentId(parent.path, component.id))
  const htmlPath = path.resolve(targetPath, pageFile)
  await File.write(htmlPath, html)

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
  const affectedPages = R.filter(page => (page.template || defaultTemplatePage) === templateId, pages)
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
  const html = await renderWithFallback(state, templateId, data, identifier)

  // write file
  const htmlPath = path.resolve(target, '_variants', `${variant.id}.html`)
  await File.write(htmlPath, html)

  debug2(state, `Builder.generateVariant(${variantId}):end`)
}

async function generateSchemaPage (state) {
  debug2(state, 'Builder.generateSchemaPage():start')

  const { config: { target } } = state
  const identifier = `Schema`

  // render schema page
  const data = getSchemaData(state)
  const templateId = defaultTemplateSchema
  const html = await renderWithFallback(state, templateId, data, identifier)

  // write file
  const htmlPath = path.resolve(target, '_schema', 'index.html')
  await File.write(htmlPath, html)

  debug2(state, 'Builder.generateSchemaPage():end')
}

async function generateSite (state) {
  debug2(state, 'Builder.generateSite():start')

  const pageIds = Object.keys(state.pages)
  const variantIds = Object.keys(state.variants)

  const schemaBuild = generateSchemaPage(state)

  const pageBuild = R.partial(generatePage, [state])
  const pageBuilds = R.map(pageBuild, pageIds)

  const pageFilesBuild = R.partial(copyPageFiles, [state])
  const pageFilesBuilds = R.map(pageFilesBuild, pageIds)

  const pageComponentsBuild = R.partial(generateComponentsForPage, [state])
  const pageComponentsBuilds = R.map(pageComponentsBuild, pageIds)

  const variantBuild = R.partial(generateVariant, [state])
  const variantBuilds = R.map(variantBuild, variantIds)

  await Promise.all([
    schemaBuild,
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
  generateSchemaPage,
  generateComponentForPage,
  generateComponentsForPage,
  generatePagesHavingComponent,
  generatePagesHavingTemplate,
  generateComponentVariants,
  generateVariant,
  copyPageFiles,
  dumpState
}
