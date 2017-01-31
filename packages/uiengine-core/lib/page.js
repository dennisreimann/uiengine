const path = require('path')
const R = require('ramda')
const glob = require('globby')
const frontmatter = require('./util/frontmatter')
const markdown = require('./util/markdown')
const PageUtil = require('./util/page')

const assocPage = (pages, page) =>
  R.assoc(page.id, page, pages)

async function readPageFile (pageFilePath) {
  const { attributes, body } = await frontmatter.fromFile(pageFilePath)
  const content = await markdown.fromString(body)

  return { attributes, content }
}

async function findPageIds (pagesPath, pageGlob = '**') {
  const pathGlob = path.resolve(pagesPath, pageGlob, PageUtil.PAGE_FILENAME)
  const pagePaths = await glob(pathGlob)
  const pageIdFromPageFilePath = R.partial(PageUtil.pageFilePathToPageId, [pagesPath])
  const pageIds = R.map(pageIdFromPageFilePath, pagePaths)

  return pageIds
}

async function fetchAll (state) {
  const pagesPath = state.config.source.pages
  if (!pagesPath) return {}

  const pageIds = await findPageIds(pagesPath)

  const pageFetch = R.partial(fetchById, [state])
  const pageFetches = R.map(pageFetch, pageIds)
  const pageList = await Promise.all(pageFetches)

  const pages = R.reduce(assocPage, {}, pageList)

  return pages
}

async function fetchById (state, pageId) {
  const pagesPath = state.config.source.pages
  const absolutePath = PageUtil.pageIdToPageFilePath(pagesPath, pageId)
  const childsPath = PageUtil.pageIdToPath(pageId)
  const childsGlob = path.join(childsPath, '*')
  const fetchChildIds = findPageIds(pagesPath, childsGlob)
  const fetchPageData = readPageFile(absolutePath)
  const [ pageData, childIds ] = await Promise.all([fetchPageData, fetchChildIds])
  const { attributes, content } = pageData
  const template = 'page'
  const baseData = { id: pageId, path: PageUtil.pageIdToPath(pageId), childIds, content, template }
  const data = R.mergeAll([baseData, attributes])

  return data
}

module.exports = {
  fetchAll,
  fetchById
}
