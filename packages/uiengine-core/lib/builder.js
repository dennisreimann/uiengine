const path = require('path')
const R = require('ramda')
const Theme = require('./theme')
const File = require('./util/file')

const pageDataFromState = (state, pageId) => {
  const pages = state.pages
  const navigation = state.navigation
  const config = {
    name: state.config.name,
    version: state.config.version
  }
  const data = { pages, navigation, config }

  return data
}

async function generatePage (state, pageId) {
  const page = state.pages[pageId]
  const templateId = page.template
  const pageData = pageDataFromState(state, pageId)
  const data = R.assoc('page', page, pageData)
  const html = await Theme.render(state, templateId, data)

  const pageDirectory = page.path === 'index' ? '' : page.path
  const targetPath = path.resolve(state.config.target.site, pageDirectory)
  const htmlPath = path.resolve(targetPath, 'index.html')
  const writeHtml = File.write(htmlPath, html)
  const copyFiles = R.map((source) => File.copy(source, path.resolve(targetPath, path.basename(source))), page.files)
  await Promise.all([writeHtml, ...copyFiles])

  return state
}

async function generateSite (state) {
  const pageIds = Object.keys(state.pages)
  const pageBuild = R.partial(generatePage, [state])
  const pageBuilds = R.map(pageBuild, pageIds)
  await Promise.all(pageBuilds)

  return state
}

module.exports = {
  generateSite,
  generatePage
}
