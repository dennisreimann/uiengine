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
  const pagesPath = state.config.basedirs.pages
  const pageIds = await findPageIds(pagesPath)

  const pageFetch = R.partial(fetchByPageId, [state])
  const pageFetches = R.map(pageFetch, pageIds)
  const pageList = await Promise.all(pageFetches)

  const pages = R.reduce(assocPage, {}, pageList)

  return pages
}

async function fetchByPageId (state, pageId) {
  const pagesPath = state.config.basedirs.pages
  const absolutePath = PageUtil.pageIdToPageFilePath(pagesPath, pageId)
  const relativePath = path.relative(pagesPath, absolutePath)
  const pageFile = { relativePath, absolutePath }
  const childsPath = PageUtil.pageIdToPath(pageId)
  const childsGlob = path.join(childsPath, '*')
  const fetchChildIds = findPageIds(pagesPath, childsGlob)
  const fetchPageData = readPageFile(absolutePath)
  const [ pageData, childIds ] = await Promise.all([ fetchPageData, fetchChildIds ])
  const { attributes, content } = pageData
  const template = 'page'
  const baseData = { id: pageId, path: PageUtil.pageIdToPath(pageId), pageFile, childIds, content, template }
  const data = R.mergeAll([baseData, attributes])

  if (data.template) {
    return data
  } else {
    return new Error(`Template attribute missing for page ${pageId}.`)
  }
}

module.exports = {
  fetchAll,
  fetchByPageId
}
