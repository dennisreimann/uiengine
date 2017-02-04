const path = require('path')
const R = require('ramda')
const glob = require('globby')
const frontmatter = require('./util/frontmatter')
const markdown = require('./util/markdown')
const PageUtil = require('./util/page')

const assocPage = (pages, page) =>
  R.assoc(page.id, page, pages)

async function readPageFile (filePath) {
  const { attributes, body } = await frontmatter.fromFile(filePath)
  const content = await markdown.fromString(body)

  return { attributes, content }
}

async function findPageIds (pagesPath, pathPattern = '**') {
  const pattern = path.resolve(pagesPath, pathPattern, PageUtil.PAGE_FILENAME)
  const pagePaths = await glob(pattern)
  const pageIdFromPageFilePath = R.partial(PageUtil.pageFilePathToPageId, [pagesPath])
  const pageIds = R.map(pageIdFromPageFilePath, pagePaths)

  return pageIds
}

async function findFiles (pagesPath, pathPattern = '**') {
  const pattern = path.resolve(pagesPath, pathPattern)
  const filePaths = await glob([pattern, `!**/${PageUtil.PAGE_FILENAME}`])

  return filePaths
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
  const pagePath = PageUtil.pageIdToPath(pageId)
  const absolutePath = PageUtil.pageIdToPageFilePath(pagesPath, pageId)
  const childPattern = path.join(pagePath, '*')
  const filesPattern = path.join(pagePath, '*.*')
  const fetchChildIds = findPageIds(pagesPath, childPattern)
  const fetchFiles = findFiles(pagesPath, filesPattern)
  const fetchPageData = readPageFile(absolutePath)
  const [ pageData, childIds, files ] = await Promise.all([fetchPageData, fetchChildIds, fetchFiles])

  const { attributes, content } = pageData
  const baseData = { id: pageId, path: pagePath, childIds, content, files }
  const data = R.mergeAll([baseData, attributes])

  return data
}

module.exports = {
  fetchAll,
  fetchById
}
