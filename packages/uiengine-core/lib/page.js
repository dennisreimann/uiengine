const path = require('path')
const R = require('ramda')
const glob = require('globby')
const frontmatter = require('./util/frontmatter')
const markdown = require('./util/markdown')
const PageUtil = require('./util/page')

const assocPage = (pages, page) =>
  R.assoc(page.id, page, pages)

// turns the list of children from the user provided attributes
// into a list of correctly named childIds
const convertUserProvidedChildrenList = (pageId, attributes = {}) => {
  let { children } = attributes
  if (typeof children !== 'object') return attributes

  const childIds = R.map((childId) =>
    childId.startsWith(`${pageId}/`) ? childId : `${pageId}/${childId}`,
    children
  )

  attributes = R.dissoc('children', attributes)
  attributes = R.assoc('childIds', childIds, attributes)

  return attributes
}

async function readPageFile (filePath) {
  let { attributes, body } = await frontmatter.fromFile(filePath)
  const content = await markdown.fromString(body)
  // prevent empty attributes from being null
  attributes = attributes || {}

  return { attributes, content }
}

async function findPageFiles (pagesPath, pagePath, childIds = []) {
  const filesPattern = path.join(pagesPath, pagePath, '{,*/}*.*')
  const pageExcludes = ['**/_{,*/}*.*', `**/${PageUtil.PAGE_FILENAME}`]
  const childExcludes = R.map(id => path.join(id, '**'), childIds)
  const excludes = R.concat(pageExcludes, childExcludes)
  const excludePatterns = R.map((exclude) => '!' + path.join(pagesPath, exclude), excludes)
  const filePaths = await glob([filesPattern, ...excludePatterns])

  return filePaths
}

async function findPageIds (state, pagePath = '**') {
  const { pages } = state.config.source
  if (!pages) return []

  const pattern = path.resolve(pages, pagePath, PageUtil.PAGE_FILENAME)
  const pagePaths = await glob(pattern)
  const pageIdFromPageFilePath = R.partial(PageUtil.pageFilePathToPageId, [pages])
  const pageIds = R.map(pageIdFromPageFilePath, pagePaths)

  return pageIds
}

async function fetchAll (state) {
  const pageIds = await findPageIds(state)

  const pageFetch = R.partial(fetchById, [state])
  const pageFetches = R.map(pageFetch, pageIds)
  const pageList = await Promise.all(pageFetches)

  const pages = R.reduce(assocPage, {}, pageList)

  return pages
}

async function fetchById (state, id) {
  const { pages } = state.config.source
  const pagePath = PageUtil.pageIdToPath(id)
  const absolutePath = PageUtil.pageIdToPageFilePath(pages, id)
  const childPattern = path.join(pagePath, '*')
  const fetchChildIds = findPageIds(state, childPattern)
  const fetchPageData = readPageFile(absolutePath)
  const [pageData, childIds] = await Promise.all([fetchPageData, fetchChildIds])
  const files = await findPageFiles(pages, pagePath, childIds)

  let { attributes, content } = pageData
  attributes = convertUserProvidedChildrenList(id, attributes)
  const title = PageUtil.pageIdToTitle(id)
  const baseData = { id, path: pagePath, title, childIds, content, files }
  const data = R.mergeAll([baseData, attributes])

  return data
}

module.exports = {
  fetchAll,
  fetchById
}
