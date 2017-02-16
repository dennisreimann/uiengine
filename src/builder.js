const path = require('path')
const R = require('ramda')
const Theme = require('./theme')
const Connector = require('./connector')
const PageUtil = require('./util/page')
const VariationUtil = require('./util/variation')
const File = require('./util/file')

const getPageData = ({ pages, navigation, config: { name, version } }, pageId) => {
  const page = pages[pageId]
  const config = { name, version }
  const data = { page, pages, navigation, config }

  return data
}

const getVariationData = ({ variations, config: { name, version } }, variationId, rendered) => {
  const variation = R.assoc('rendered', rendered, variations[variationId])
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

  return state
}

async function generatePage (state, pageId) {
  const { pages, config } = state
  const page = pages[pageId]
  const templateId = page.template || 'page'
  const data = getPageData(state, pageId)
  const html = await Theme.render(state, templateId, data)

  // write file and copy files belonging to the page
  const targetPagePath = page.path === 'index' ? '' : page.path
  const sourcePagePath = PageUtil.pageIdToPath(page.id)
  const targetPath = path.resolve(config.target, targetPagePath)
  const sourcePath = path.resolve(config.source.pages, sourcePagePath)
  const htmlPath = path.resolve(targetPath, 'index.html')
  const writeHtml = File.write(htmlPath, html)
  const copyFile = R.partial(copyPageFile, [targetPath, sourcePath])
  const copyFiles = R.map(copyFile, page.files)
  await Promise.all([writeHtml, ...copyFiles])

  return state
}

async function generateComponent (state, componentId) {
  const { components } = state
  const component = components[componentId]
  const variationIds = component.variationIds || []

  const generate = R.partial(generateVariation, [state])
  const generateVariations = R.map(generate, variationIds)
  await Promise.all(generateVariations)

  return state
}

async function generateVariation (state, variationId) {
  const { variations, config } = state
  const variation = variations[variationId]
  if (!variation) return Promise.reject(`Variation "${variationId}" does not exist or has not been fetched yet.`)

  // render raw variation, without layout
  const { context, path: filePath } = variation
  const rendered = await Connector.render(state, filePath, context)

  // render variation preview, with layout
  const data = getVariationData(state, variationId, rendered)
  const templateFileName = variation.template || config.templates.variation
  const templatePath = path.join(config.source.templates, templateFileName)
  const html = await Connector.render(state, templatePath, data)

  // write file
  const htmlPath = path.resolve(config.target, VariationUtil.VARIATIONS_DIRNAME, `${variation.id}.html`)
  await File.write(htmlPath, html)

  return state
}

async function generateSite (state) {
  const pageIds = Object.keys(state.pages)
  const pageBuild = R.partial(generatePage, [state])
  const pageBuilds = R.map(pageBuild, pageIds)

  const componentIds = Object.keys(state.components)
  const componentBuild = R.partial(generateComponent, [state])
  const componentBuilds = R.map(componentBuild, componentIds)

  await Promise.all([...pageBuilds, ...componentBuilds])

  return state
}

module.exports = {
  generateSite,
  generatePage,
  generateComponent,
  generateVariation,
  dumpState
}
