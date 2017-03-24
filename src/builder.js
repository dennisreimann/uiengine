const path = require('path')
const R = require('ramda')
const chalk = require('chalk')
const Theme = require('./theme')
const Connector = require('./connector')
const File = require('./util/file')
const PageUtil = require('./util/page')
const VariationUtil = require('./util/variation')

// Theme templates need to be prefixed with "theme:" to be referenced
// as an alternative page template. This might be the case for certain
// pages like the homepage or sandbox overview.
// The variation template default does not have this prefix, because
// by definition it must be an application template of the project.
const themeTemplatePrefix = 'theme:'
const defaultTemplatePage = themeTemplatePrefix + 'page'
const defaultTemplateComponent = themeTemplatePrefix + 'component'
const defaultTemplateVariation = 'variation'
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

    if (!template) throw new Error(chalk.red(`Template "${templateId}" does not exist.\n\nIn case you want to reference an existing theme template,\nplease prefix it with "theme:" – i.e. "theme:page".\n\nIf this is supposed to be a custom template, add it to the\ntemplates source directory or refer to it like this:\n\ntemplates:\n  ${templateId}: PATH_RELATIVE_TO_TEMPLATES_SOURCE\n\n`) + chalk.gray(`Registered templates:\n\n${JSON.stringify(templates, null, '  ')}`))

    return Connector.render(state, template, data)
  }
}

const getPageData = ({ pages, navigation, components, variations, config }, pageId) => {
  const page = pages[pageId]

  if (isThemeTemplate(page.template)) {
    return { page, pages, components, variations, navigation, config }
  } else {
    return page.context || {}
  }
}

const getComponentData = ({ pages, navigation, components, variations, config }, pageId, componentId) => {
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

  const data = { page, pages, component, components, variations, navigation, config }

  return data
}

const getVariationData = ({ variations, config }, variationId) => {
  const variation = variations[variationId]
  const data = { variation, config }

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

  const build = R.partial(generateComponentForPage, [state])
  const builds = []

  // FIXME: This is ugly!
  R.map((page) => {
    const componentIds = page.componentIds || []
    if (componentIds.includes(componentId)) {
      builds.push(build(page.id, componentId))
    }
  }, pages)

  await Promise.all(builds)
}

async function generateComponentVariations (state, componentId) {
  const { components } = state
  const component = components[componentId]
  const variationIds = component.variationIds || []
  const build = R.partial(generateVariation, [state])
  const builds = R.map(build, variationIds)

  await Promise.all(builds)
}

async function generateVariation (state, variationId) {
  const { variations, config: { target } } = state
  const variation = variations[variationId]
  if (!variation) return Promise.reject(`Variation "${variationId}" does not exist or has not been fetched yet.`)

  // render variation preview, with layout
  const data = getVariationData(state, variationId)
  const templateId = variation.template || defaultTemplateVariation
  const html = await render(state, templateId, data)

  // write file
  const htmlPath = path.resolve(target, VariationUtil.VARIATIONS_DIRNAME, `${variation.id}.html`)
  await File.write(htmlPath, html)
}

async function generateSite (state) {
  const pageIds = Object.keys(state.pages)
  const variationIds = Object.keys(state.variations)

  const pageBuild = R.partial(generatePage, [state])
  const pageBuilds = R.map(pageBuild, pageIds)

  const pageFilesBuild = R.partial(copyPageFiles, [state])
  const pageFilesBuilds = R.map(pageFilesBuild, pageIds)

  const pageComponentsBuild = R.partial(generateComponentsForPage, [state])
  const pageComponentsBuilds = R.map(pageComponentsBuild, pageIds)

  const variationBuild = R.partial(generateVariation, [state])
  const variationBuilds = R.map(variationBuild, variationIds)

  await Promise.all([
    ...pageBuilds,
    ...pageFilesBuilds,
    ...pageComponentsBuilds,
    ...variationBuilds
  ])
}

module.exports = {
  generateSite,
  generatePage,
  generateComponentForPage,
  generateComponentsForPage,
  generatePagesHavingComponent,
  generateComponentVariations,
  generateVariation,
  copyPageFiles,
  dumpState
}
