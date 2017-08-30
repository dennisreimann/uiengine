import path from 'path'
import assert from 'assert'
import highlightjs from 'highlight.js'

const pageFile = 'index.html'
const assetsDir = '_uiengine-theme'
const manifestPath = path.resolve(__dirname, '..', 'static', assetsDir, 'rev-manifest.json')
const localesPath = path.resolve(__dirname, '..', 'static', assetsDir, 'locales')
const supportedLocales = ['en', 'de']

const revvedFile = (filePath) => {
  let revs
  try { revs = require(manifestPath) } catch (err) { }
  const file = (revs && revs[filePath]) || filePath
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

const titleize = string =>
  String(string)
    .replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase())

const decorateRaw = (code, lang) =>
  highlight(code, lang)

const decorateContext = json =>
  highlight(jsonEscape(json), 'json')

const decorateRendered = html =>
  highlight(html, 'html')

// function that binds the current page data and returns
// an object with helper functions based on that data
export default function (options, data) {
  const { navigationId, navigation, schema } = data
  const currentItem = navigation[navigationId]
  const customPropertyTypes = schema ? Object.keys(schema) : []

  assert(currentItem, `Missing navigation item for page "${navigationId}".`)

  const assetPath = (filePath) => {
    const target = revvedFile(filePath)
    const source = path.join(currentItem.path, pageFile)

    return relativePath(target, source)
  }

  const lang = supportedLocales.includes(options.lang) ? options.lang : 'en'
  const skin = options.skin || 'default'
  const hljs = options.hljs || 'atom-one-dark'
  const hljsPath = assetPath(`styles/hljs/${hljs}.css`)
  const stylesPath = assetPath(`styles/uiengine-${skin}.css`)
  const scriptsPath = assetPath('scripts/uiengine.js')
  const localePath = path.resolve(localesPath, `${lang}.json`)
  const localized = require(localePath)

  return {
    dasherize,
    titleize,
    decorateRaw,
    decorateContext,
    decorateRendered,
    assetPath,
    stylesPath,
    scriptsPath,
    hljsPath,
    lang,

    t (key) {
      return key.split('.').reduce((a, b) => a && a[b], localized)
    },

    propertyType (type) {
      const [displayName, normalizedType] = type.match(/^\[?([\w\s|]+)\]?$/i)
      if (customPropertyTypes.includes(normalizedType)) {
        const target = path.join('_schema', pageFile)
        const source = path.join(currentItem.path, pageFile)
        const anchor = dasherize(normalizedType)

        return `<a href="${relativePath(target, source)}#${anchor}">${displayName}</a>`
      } else {
        return displayName
      }
    },

    pagePreviewPath (pagePath, templateId) {
      const target = path.join(pagePath, `_${templateId}.html`)
      const source = path.join(currentItem.path, pageFile)

      return relativePath(target, source)
    },

    variantPreviewPath (variantId) {
      const target = path.join('_variants', `${variantId}.html`)
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
