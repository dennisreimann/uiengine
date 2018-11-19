const { dirname, join, relative, resolve } = require('path')
const R = require('ramda')
const glob = require('globby')
const {
  MarkdownUtil,
  FileUtil: { requireUncached },
  PageUtil: { PAGE_CONFNAME, PAGE_DOCSNAME, pageFilePathToId, pageIdToFilePath, pageIdToPath, pageIdToTitle, determineType, convertUserProvidedChildrenList, convertUserProvidedComponentsList },
  StringUtil: { titleFromContentHeading },
  DebugUtil: { debug2, debug3, debug4 }
} = require('@uiengine/util')

async function readPageFiles (state, id) {
  debug4(state, `Page.readPageFiles(${id}):start`)

  const { base, pages } = state.config.source

  const configPath = pageIdToFilePath(pages, id)
  const dir = dirname(configPath)
  const docsPath = join(dir, PAGE_DOCSNAME)
  const data = { attributes: {}, sourcePath: relative(base, dir) }

  // config
  try {
    data.attributes = requireUncached(configPath)
    data.sourceFile = relative(base, configPath)
  } catch (err) { }

  // readme
  try {
    data.content = await MarkdownUtil.fromFile(docsPath)
    data.readmeFile = relative(base, docsPath)
  } catch (err) { }

  debug4(state, `Page.readPageFiles(${id}):end`)

  return data
}

async function findPageFiles (pagesPath, pagePath, childIds = []) {
  // see the glob option described here for details:
  // https://github.com/mrmlnc/fast-glob#how-to-exclude-directory-from-reading
  const filesPattern = join(pagesPath, pagePath, '**')
  const pageExcludes = [join('**', '_*', '**'), join('**', `{${PAGE_CONFNAME},${PAGE_DOCSNAME}}`)]
  const childExcludes = R.map(id => join('**', id, '**'), childIds)
  const ignore = R.concat(pageExcludes, childExcludes)
  const filePaths = await glob(filesPattern, { ignore })

  return filePaths
}

async function findPageIds (state, pagePath = '**') {
  const { pages } = state.config.source
  if (!pages) return []

  const pattern = resolve(pages, pagePath, `{${PAGE_CONFNAME},${PAGE_DOCSNAME}}`)
  const pagePaths = await glob(pattern)
  const pageIdFromPageFilePath = R.partial(pageFilePathToId, [pages])
  const pageIds = R.uniq(R.map(pageIdFromPageFilePath, pagePaths))

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

  const { pages } = state.config.source
  const pagePath = pageIdToPath(id)
  const childPattern = join(pagePath, '*')
  const fetchChildIds = findPageIds(state, childPattern)
  const fetchPageData = readPageFiles(state, id)

  // fetch childPageIds before fetching files to exclude
  // the children directories when looking for files
  const [pageData, childIds] = await Promise.all([fetchPageData, fetchChildIds])
  const files = await findPageFiles(pages, pagePath, childIds)

  let { attributes, content, sourcePath, sourceFile, readmeFile } = pageData

  const title = attributes.title || titleFromContentHeading(content) || pageIdToTitle(id)
  const type = determineType(attributes)
  attributes = convertUserProvidedChildrenList(id, childIds, attributes)
  attributes = convertUserProvidedComponentsList(id, attributes)
  const baseData = { childIds }
  const fixData = { id, title, path: pagePath, sourcePath, sourceFile, readmeFile, type, content, files }
  const data = R.mergeAll([baseData, attributes, fixData])

  if (data.files.length === 0) delete data.files

  debug3(state, `Page.fetchById(${id}):end`)

  return data
}

module.exports = {
  fetchAll,
  fetchById
}
