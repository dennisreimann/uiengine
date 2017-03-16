import path from 'path'
import assert from 'assert'
import highlightjs from 'highlight.js'

const pageFile = 'index.html'
const assetsDir = '_uiengine-theme'
const manifestPath = path.resolve(__dirname, '..', 'static', assetsDir, 'rev-manifest.json')

const revvedFile = (filePath) => {
  let revs
  try { revs = require(manifestPath) } catch (err) { }
  const file = revs && revs[filePath] || filePath
  return `${assetsDir}/${file}`
}

const relativePath = (toPath, fromPath) => {
  const relative = path.relative(fromPath, toPath)

  if (relative) {
    return relative.replace(/^\.\.\//, '')
  } else { // from == to
    return path.basename(toPath)
  }
}

// TODO: Add proper localization support
const t = (string) =>
  string

const htmlEscape = html =>
  String(html)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')

const jsonEscape = json =>
  JSON.stringify(json, null, '  ')

const highlight = (code, lang) => {
  const languages = (lang != null) ? [lang] : undefined
  const highlighted = highlightjs.highlightAuto(code, languages)

  return highlighted.value
}

const dasherize = string =>
  String(string)
    .replace(/\W+/gi, '-')

const decorateRaw = (code, lang) =>
  highlight(code, lang)

const decorateContext = json =>
  highlight(jsonEscape(json), 'json')

const decorateRendered = html =>
  highlight(html, 'html')

// function that binds the current page data and returns
// an object with helper functions based on that data
export default function (options, data) {
  const { page, navigation } = data
  const currentItem = navigation[page.id]

  assert(currentItem, `Missing navigation item for page "${page.id}".`)

  const assetPath = (filePath) => {
    const target = revvedFile(filePath)
    const source = path.join(currentItem.path, pageFile)

    return relativePath(target, source)
  }

  const look = options.look || 'default'
  const hljs = options.hljs || 'tomorrow'
  const hljsPath = assetPath(`styles/hljs/${hljs}.css`)
  const stylesPath = assetPath(`styles/uiengine-${look}.css`)
  const scriptsPath = assetPath('scripts/uiengine.js')

  return {
    t,
    dasherize,
    decorateRaw,
    decorateContext,
    decorateRendered,
    assetPath,
    stylesPath,
    scriptsPath,
    hljsPath,

    variationPreviewPath (variationId) {
      const target = path.join('variations', `${variationId}.html`)
      const source = path.join(currentItem.path, pageFile)

      return relativePath(target, source)
    },

    isCurrentPage (item) {
      return item.id === currentItem.id
    },

    isActivePage (item) {
      return this.isCurrentPage(item) || (currentItem.parentIds.includes(item.id) && item.id !== 'index')
    },

    pageLink (item) {
      const target = path.join(item.path, pageFile)
      const source = path.join(currentItem.path, pageFile)
      const href = relativePath(target, source)

      return href
    }
  }
}
