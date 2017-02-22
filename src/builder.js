const path = require('path')
const R = require('ramda')
const Theme = require('./theme')
const Connector = require('./connector')
const File = require('./util/file')
const PageUtil = require('./util/page')
const VariationUtil = require('./util/variation')

const pageFile = 'index.html'

const getPageData = ({ pages, navigation, components, variations, config: { name, version } }, pageId) => {
  const page = pages[pageId]
  const config = { name, version }
  const data = { page, pages, components, variations, navigation, config }

  return data
}

const getComponentData = ({ pages, navigation, components, variations, config: { name, version } }, pageId, componentId) => {
  const parent = pages[pageId]
  const component = components[componentId]
  const page = {
    id: PageUtil.pageIdForComponentId(parent.id, component.id),
    path: PageUtil.pagePathForComponentId(parent.path, component.id),
    title: component.title,
    childIds: [],
    files: [],
    content: component.content
  }

  const config = { name, version }
  const data = { page, pages, component, components, variations, navigation, config }

  return data
}

const getVariationData = ({ variations, config: { name, version } }, variationId) => {
  const variation = variations[variationId]
  const config = { name, version }
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
  const templateId = page.template || 'page'
  const data = getPageData(state, pageId)
  const html = await Theme.render(state, templateId, data)

  const targetPagePath = PageUtil.isIndexPagePath(page.path) ? '' : page.path
  const targetPath = path.resolve(config.target, targetPagePath)
  const htmlPath = path.resolve(targetPath, pageFile)

  await File.write(htmlPath, html)
}

async function generatePageComponents (state, pageId) {
  const { pages } = state
  const page = pages[pageId]
  const componentIds = page.componentIds || []
  const build = R.partial(generatePageComponent, [state, pageId])
  const builds = R.map(build, componentIds)

  await Promise.all(builds)
}

async function generatePageComponent (state, pageId, componentId) {
  const { components, pages, config: { target } } = state
  const parent = pages[pageId]
  const component = components[componentId]
  const templateId = component.template || 'component'
  const data = getComponentData(state, pageId, componentId)
  const html = await Theme.render(state, templateId, data)

  const targetPath = path.join(target, PageUtil.pagePathForComponentId(parent.path, component.id))
  const htmlPath = path.resolve(targetPath, pageFile)
  await File.write(htmlPath, html)
}

async function generateComponentPages (state, componentId) {
  const { pages } = state

  const build = R.partial(generatePage, [state])
  const builds = []

  // FIXME: This is ugly!
  R.map((page) => {
    const componentIds = page.componentIds || []
    if (componentIds.includes(componentId)) {
      builds.push(build(page.id))
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
  const { variations, config: { source, target, templates } } = state
  const variation = variations[variationId]
  if (!variation) return Promise.reject(`Variation "${variationId}" does not exist or has not been fetched yet.`)

  // render variation preview, with layout
  const data = getVariationData(state, variationId)
  const templateId = variation.template || 'variation'
  const templateFile = templates[templateId]
  if (!templateFile) return Promise.reject(`Template "${templateId}" for variation "${variationId}" does not exist. Please add it to your configuration.`)

  const templatePath = path.join(source.templates, templateFile)
  const html = await Connector.render(state, templatePath, data)

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

  const pageComponentsBuild = R.partial(generatePageComponents, [state])
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
  generatePageComponents,
  generateComponentPages,
  generateComponentVariations,
  generateVariation,
  copyPageFiles,
  dumpState
}
