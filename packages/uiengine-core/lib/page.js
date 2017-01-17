const path = require('path')
const R = require('ramda')
const glob = require('globby')
const frontmatter = require('./util/frontmatter')
const markdown = require('./util/markdown')

const PAGE_FILENAME = 'page.md'

const pageIdToPageFilePath = (pagesPath, pageId) => {
  const relativePath = pageId === 'index' ? '.' : pageId
  const absolutePath = path.join(pagesPath, relativePath, PAGE_FILENAME)

  return absolutePath
}

const pageFilePathToPageId = (pagesPath, pageFilePath) => {
  const relativePath = path.relative(pagesPath, pageFilePath)
  const dirname = path.dirname(relativePath)
  const pageId = dirname === '.' ? 'index' : dirname

  return pageId
}

async function readPageFile (pageFilePath) {
  const { attributes, body } = await frontmatter.fromFile(pageFilePath)
  const content = await markdown.fromString(body)

  return { attributes, content }
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
  const pageList = await Promise.all(pageFetches)

  const assocPage = (pages, page) => R.assoc(page.id, page, pages)
  const pages = R.reduce(assocPage, {}, pageList)

  return pages
}

async function fetchByPageId (state, pageId) {
  const pagesPath = state.config.basedirs.pages
  const absolutePath = pageIdToPageFilePath(pagesPath, pageId)
  const relativePath = path.relative(pagesPath, absolutePath)
  const pageFile = { relativePath, absolutePath }
  const childGlob = path.join(pageId, '*')
  const fetchChildren = findPageIds(pagesPath, childGlob)
  const fetchPageData = readPageFile(absolutePath)
  const [ pageData, children ] = await Promise.all([ fetchPageData, fetchChildren ])
  const { attributes, content } = pageData
  const baseData = { id: pageId, pageFile: pageFile, children: children, content: content }
  const data = R.mergeAll([baseData, attributes])

  return data
}

module.exports = {
  fetchAll,
  fetchByPageId
}
