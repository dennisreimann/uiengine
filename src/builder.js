const path = require('path')
const R = require('ramda')
const chalk = require('chalk')
const Theme = require('./theme')
const Connector = require('./connector')
const File = require('./util/file')
const PageUtil = require('./util/page')
const VariantUtil = require('./util/variant')

// Theme templates need to be prefixed with "theme:" to be referenced
// as an alternative page template. This might be the case for certain
// pages like the homepage or sandbox overview.
// The variant template default does not have this prefix, because
// by definition it must be an application template of the project.
const themeTemplatePrefix = 'theme:'
const defaultTemplatePage = themeTemplatePrefix + 'page'
const defaultTemplateComponent = themeTemplatePrefix + 'component'
const defaultTemplateVariant = 'variant'
const pageFile = 'index.html'

const isThemeTemplate = templateId =>
  !templateId || templateId.startsWith(themeTemplatePrefix)

const render = (state, templateId, data) => {
  if (isThemeTemplate(templateId)) {
    const template = templateId.substring(themeTemplatePrefix.length)
    return Theme.render(state, template, data)
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

    return Connector.render(state, template, data)
  }
}

const getPageData = ({ pages, navigation, components, variants, config }, pageId) => {
  const page = pages[pageId]

  if (isThemeTemplate(page.template)) {
    return { page, pages, components, variants, navigation, config }
  } else {
    return page.context || {}
  }
}

const getComponentData = ({ pages, navigation, components, variants, config }, pageId, componentId) => {
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

  const data = { page, pages, component, components, variants, navigation, config }

  return data
}

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

async function dumpState (state) {
  const json = JSON.stringify(state, null, '  ')
  const filePath = path.resolve(state.config.target, 'state.json')

  await File.write(filePath, json)
}

async function copyPageFiles (state, pageId) {
  const { pages, config } = state
  const page = pages[pageId]
  const targetPagePath = PageUtil.isIndexPagePath(page.path) ? '' : page.path
  const sourcePagePath = PageUtil.pageIdToPath(page.id)
  const targetPath = path.resolve(config.target, targetPagePath)
  const sourcePath = path.resolve(config.source.pages, sourcePagePath)
  const copyFile = R.partial(copyPageFile, [targetPath, sourcePath])
  const copyFiles = R.map(copyFile, page.files)

  await Promise.all(copyFiles)
}

async function generatePage (state, pageId) {
  const { pages, config } = state
  const page = pages[pageId]
  const templateId = page.template || defaultTemplatePage
  const data = getPageData(state, pageId)
  const html = await render(state, templateId, data)

  const targetPagePath = PageUtil.isIndexPagePath(page.path) ? '' : page.path
  const targetPath = path.resolve(config.target, targetPagePath)
  const htmlPath = path.resolve(targetPath, pageFile)

  await File.write(htmlPath, html)
}

async function generateComponentsForPage (state, pageId) {
  const { pages } = state
  const page = pages[pageId]
  const componentIds = page.componentIds || []
  const build = R.partial(generateComponentForPage, [state, pageId])
  const builds = R.map(build, componentIds)

  await Promise.all(builds)
}

async function generateComponentForPage (state, pageId, componentId) {
  const { components, pages, config: { target } } = state
  const parent = pages[pageId]
  const component = components[componentId]
  const templateId = component.template || defaultTemplateComponent
  const data = getComponentData(state, pageId, componentId)
  const html = await render(state, templateId, data)

  const targetPath = path.join(target, PageUtil.pagePathForComponentId(parent.path, component.id))
  const htmlPath = path.resolve(targetPath, pageFile)
  await File.write(htmlPath, html)
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
  const { components } = state
  const component = components[componentId]
  const variantIds = component.variantIds || []
  const build = R.partial(generateVariant, [state])
  const builds = R.map(build, variantIds)

  await Promise.all(builds)
}

async function generateVariant (state, variantId) {
  const { variants, config: { target } } = state
  const variant = variants[variantId]
  if (!variant) return new Error(`variant "${variantId}" does not exist or has not been fetched yet.`)

  // render variant preview, with layout
  const data = getVariantData(state, variantId)
  const templateId = variant.template || defaultTemplateVariant
  const html = await render(state, templateId, data)

  // write file
  const htmlPath = path.resolve(target, VariantUtil.VARIANTS_DIRNAME, `${variant.id}.html`)
  await File.write(htmlPath, html)
}

async function generateSite (state) {
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
