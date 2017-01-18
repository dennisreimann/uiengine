const R = require('ramda')
const Renderer = require('./renderer')

const pageDataFromState = (state, pageId) => {
  const pages = state.pages
  const navigation = state.navigation
  const config = {
    config: {
      name: state.config.name,
      version: state.config.version
    }
  }
  const data = { pages, navigation, config }

  return data
}

async function generatePage (state, pageId) {
  const page = state.pages[pageId]
  const templateId = page.template
  const pageData = pageDataFromState(state, pageId)
  const data = R.assoc('page', page, pageData)

  const rendered = await Renderer.renderTemplate(state, templateId, data)
}

async function generateSite (state) {
  const pageIds = Object.keys(state.pages)
  const pageBuild = R.partial(generatePage, [state])
  const pageBuilds = R.map(pageBuild, pageIds)
  await Promise.all(pageBuilds)

  return state
}

module.exports = {
  generateSite
}
