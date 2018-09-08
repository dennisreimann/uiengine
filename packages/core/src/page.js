const { dirname, join, relative, resolve } = require('path')
const R = require('ramda')
const glob = require('globby')
const {
  FrontmatterUtil,
  MarkdownUtil,
  PageUtil: { ENTITIES_ID, ENTITIES_PAGE_PATH, PAGE_FILENAME, pageFilePathToId, pageIdToFilePath, pageIdToPath, pageIdToTitle, isIndexPage, determineType, convertUserProvidedChildrenList, convertUserProvidedComponentsList },
  StringUtil: { titleFromContentHeading },
  DebugUtil: { debug2, debug3, debug4 }
} = require('@uiengine/util')

async function readPageFile (state, filePath) {
  debug4(state, `Page.readPageFile(${filePath}):start`)

  const { source } = state.config
  try {
    let { attributes, body } = await FrontmatterUtil.fromFile(filePath, source)
    const content = await MarkdownUtil.fromString(body)
    // prevent empty attributes from being null
    attributes = attributes || {}

    debug4(state, `Page.readPageFile(${filePath}):end`)

    return { attributes, content }
  } catch (err) {
    throw err
  }
}

async function findPageFiles (pagesPath, pagePath, childIds = []) {
  // see the glob option descreibed here for details:
  // https://github.com/mrmlnc/fast-glob#how-to-exclude-directory-from-reading
  const filesPattern = join(pagesPath, pagePath, '**')
  const pageExcludes = [join('**', '_*', '**'), join('**', PAGE_FILENAME)]
  const childExcludes = R.map(id => join('**', id, '**'), childIds)
  const ignore = R.concat(pageExcludes, childExcludes)
  const filePaths = await glob(filesPattern, { ignore })

  return filePaths
}

async function findPageIds (state, pagePath = '**') {
  const { pages } = state.config.source
  if (!pages) return []

  const pattern = resolve(pages, pagePath, PAGE_FILENAME)
  const pagePaths = await glob(pattern)
  const pageIdFromPageFilePath = R.partial(pageFilePathToId, [pages])
  const pageIds = R.map(pageIdFromPageFilePath, pagePaths)

  return pageIds
}

async function fetchAll (state) {
  debug2(state, `Page.fetchAll():start`)

  const pageIds = await findPageIds(state)

  const pageFetch = R.partial(fetchById, [state])
  const pageFetches = R.map(pageFetch, pageIds)
  const pageList = await Promise.all(pageFetches)

  const pages = R.reduce((pages, page) => R.assoc(page.id, page, pages), {}, pageList)

  debug2(state, `Page.fetchAll():end`)

  return pages
}

async function fetchById (state, id) {
  debug3(state, `Page.fetchById(${id}):start`)

  const { pages, base } = state.config.source
  const pagePath = pageIdToPath(id)
  const absolutePath = pageIdToFilePath(pages, id)
  const sourceFile = relative(base, absolutePath)
  const sourcePath = dirname(sourceFile)
  const childPattern = join(pagePath, '*')
  const fetchChildIds = findPageIds(state, childPattern)
  const fetchPageData = readPageFile(state, absolutePath)

  // fetch childPageIds before fetching files to exclude
  // the children directories when looking for files
  const [pageData, childIds] = await Promise.all([fetchPageData, fetchChildIds])
  const files = await findPageFiles(pages, pagePath, childIds)

  if (isIndexPage(id)) childIds.push(ENTITIES_ID)

  let { attributes, content } = pageData

  const title = attributes.title || titleFromContentHeading(content) || pageIdToTitle(id)
  const type = determineType(attributes)
  attributes = convertUserProvidedChildrenList(id, childIds, attributes)
  attributes = convertUserProvidedComponentsList(id, attributes)
  const baseData = { childIds }
  const fixData = { id, title, path: pagePath, sourcePath, sourceFile, type, content, files }
  const data = R.mergeAll([baseData, attributes, fixData])

  if (data.files.length === 0) delete data.files

  debug3(state, `Page.fetchById(${id}):end`)

  return data
}

function fetchEntitiesPage (state) {
  return {
    id: ENTITIES_ID,
    path: ENTITIES_PAGE_PATH,
    type: 'entities',
    title: 'Entities',
    keywords: Object.keys(state.entities || []),
    childIds: []
  }
}

module.exports = {
  fetchAll,
  fetchEntitiesPage,
  fetchById
}
