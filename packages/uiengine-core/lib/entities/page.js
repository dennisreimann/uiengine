const path = require('path')
const R = require('ramda')
const glob = require('globby')
const yaml = require('../util/yaml')

const PAGE_FILENAME = 'page.yml'

const pageIdToPageFilePath = (pagesPath, pageId) => {
  const relativePath = pageId === 'index' ? '.' : pageId
  const absolutePath = path.join(pagesPath, relativePath, PAGE_FILENAME)

  return absolutePath
}

const pageFilePathToPageId = (pagesPath, pageFilePath) => {
  const relativePath = path.relative(pagesPath, pageFilePath)
  const pageId = path.dirname(relativePath)

  return pageId
}

async function findPageIds (pagesPath, pageGlob = '**') {
  const pathGlob = path.resolve(pagesPath, pageGlob, PAGE_FILENAME)
  const pagePaths = await glob(pathGlob)
  const pageIdFromPageFilePath = R.partial(pageFilePathToPageId, [pagesPath])
  const pageIds = R.map(pageIdFromPageFilePath, pagePaths)

  return pageIds
}

async function fetchAll (state) {
  const pagesPath = state.config.basedirs.pages
  const pageIds = await findPageIds(pagesPath)

  const pageFetch = R.partial(fetchByPageId, [state])
  const pageFetches = R.map(pageFetch, pageIds)

  return Promise.all(pageFetches)
}

async function fetchByPageId (state, pageId) {
  const pagesPath = state.config.basedirs.pages
  const absolutePath = pageIdToPageFilePath(pagesPath, pageId)
  const relativePath = path.relative(pagesPath, absolutePath)
  const pageFile = { relativePath, absolutePath }
  const childGlob = path.join(pageId, '*')
  const fetchChildren = findPageIds(pagesPath, childGlob)
  const fetchPageData = yaml.readFile(absolutePath)
  const [ pageData, children ] = await Promise.all([fetchPageData, fetchChildren])
  const baseData = { id: pageId, pageFile: pageFile, children: children }
  const data = R.mergeAll([baseData, pageData])

  return data
}

module.exports = {
  fetchAll,
  fetchByPageId
}
