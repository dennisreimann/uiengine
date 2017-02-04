const path = require('path')
const R = require('ramda')
const Theme = require('./theme')
const Templating = require('./templating')
const File = require('./util/file')

const pageDataFromState = ({ pages, navigation, config: { name, version } }, pageId) => {
  const config = { name, version }
  const data = { pages, navigation, config }

  return data
}

const variationDataFromState = ({ config: { name, version } }, variationId) => {
  const config = { name, version }
  const data = { config }

  return data
}

const copyPageFile = (targetPath, source) => {
  const fileName = path.basename(source)
  const target = path.resolve(targetPath, fileName)

  return File.copy(source, target)
}

async function dumpState (state) {
  const json = JSON.stringify(state, null, '  ')
  const filePath = path.resolve(state.config.target.site, 'state.json')

  await File.write(filePath, json)

  return state
}

async function generatePage (state, pageId) {
  const { pages, config } = state
  const page = pages[pageId]
  const templateId = page.template || 'page'
  const pageData = pageDataFromState(state, pageId)
  const data = R.assoc('page', page, pageData)
  const html = await Theme.renderTemplate(state, templateId, data)

  // write file and copy files belonging to the page
  const pageDirectory = page.path === 'index' ? '' : page.path
  const targetPath = path.resolve(config.target.site, pageDirectory)
  const htmlPath = path.resolve(targetPath, 'index.html')
  const writeHtml = File.write(htmlPath, html)
  const copyFile = R.partial(copyPageFile, [targetPath])
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
  if (!variation) {
    return Promise.reject(`Variation "${variationId}" does not exist or has not been fetched yet.`)
  }

  const templateId = variation.template || 'variation'
  const { context, raw, path } = variation
  const rendered = await Templating.renderString(state, raw, context, { path })

  let data = variationDataFromState(state, variationId)
  data = R.assoc('variation', variation, data)
  data = R.assocPath(['variation', 'rendered'], rendered, data)
  const html = await Templating.renderTemplate(state, templateId, data)

  // write file
  const htmlPath = path.resolve(config.target.site, 'variations', `${variation.id}.html`)
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
  generateVariation,
  dumpState
}
