const path = require('path')
const R = require('ramda')
const glob = require('globby')
const Connector = require('./connector')
const Markdown = require('./util/markdown')
const Frontmatter = require('./util/frontmatter')
const VariantUtil = require('./util/variant')
const File = require('./util/file')
const { error } = require('./util/message')
const { debug2, debug3, debug4, debug5 } = require('./util/debug')

const regexpClean = new RegExp('([\\s]*?<!--\\s?omit:.*?\\s?-->)', 'gi')

const omit = (mark, string) => {
  const regexpOmit = new RegExp(`([\\s]*?<!--\\s?omit:${mark}:start\\s?-->[\\s\\S]*?<!--\\s?omit:${mark}:end\\s?-->)`, 'gi')

  return string.replace(regexpOmit, '').replace(regexpClean, '')
}

const assocVariant = (variants, variant) =>
  R.assoc(variant.id, variant, variants)

async function readVariantFile (state, filePath) {
  debug4(state, `Variant.readVariantFile(${filePath}):start`)

  const { source } = state.config
  const variantName = path.basename(filePath, path.extname(filePath))
  const variantFile = path.join(path.dirname(filePath), `${variantName}.md`)
  let data = { attributes: {} } // in case there is no variant file

  try {
    const variant = await Frontmatter.fromFile(variantFile, source)
    const { attributes, body } = variant
    const content = await Markdown.fromString(body)

    data = { attributes, content }
  } catch (err) {
    debug5(state, 'Could not read variant file', filePath, err)
  }

  debug4(state, `Variant.readVariantFile(${filePath}):end`)

  return data
}

async function findVariantIds (state, componentPath = '**') {
  const { components } = state.config.source
  if (!components) return []

  const variantsPath = VariantUtil.componentIdToVariantsPath(components, componentPath)
  const pattern = path.join(variantsPath, '*')
  const excludePattern = '!' + path.join(variantsPath, '*.{md,marko.js}')
  const variantPaths = await glob([pattern, excludePattern])

  const variantFilePathToVariantId = R.partial(VariantUtil.variantFilePathToVariantId, [components])
  const variantIds = R.map(variantFilePathToVariantId, variantPaths)

  return variantIds
}

async function fetchAll (state) {
  debug2(state, `Variant.fetchAll():start`)

  const componentsPath = state.config.source.components
  if (!componentsPath) return {}

  const variantIds = await findVariantIds(state)

  const variantFetch = R.partial(fetchById, [state])
  const variantFetches = R.map(variantFetch, variantIds)
  const variantList = await Promise.all(variantFetches)

  const variants = R.reduce(assocVariant, {}, variantList)

  debug2(state, `Variant.fetchAll():end`)

  return variants
}

async function fetchById (state, id) {
  debug3(state, `Variant.fetchById(${id}):start`)

  const componentsPath = state.config.source.components
  const componentId = VariantUtil.variantIdToComponentId(id)
  const filePath = VariantUtil.variantIdToVariantFilePath(componentsPath, id)
  const extension = File.extension(filePath)
  let { attributes, content } = await readVariantFile(state, filePath)

  const title = VariantUtil.variantIdToTitle(id)
  const context = attributes.context
  attributes = R.dissoc('context', attributes)
  attributes = R.merge({ title }, attributes)

  // render raw variant, without layout
  let raw, rendered
  const readTemplate = File.read(filePath)
  const renderTemplate = Connector.render(state, filePath, context)

  try {
    [raw, rendered] = await Promise.all([readTemplate, renderTemplate])
  } catch (err) {
    rendered = `<!DOCTYPE html><html><body><pre>${err}</pre></body></html>`
    console.error(error(`Variant "${id}" could not be rendered!`, err))
  }

  // adjust raw and rendered: omit marked parts
  if (raw) raw = omit('code', raw)
  if (rendered) rendered = omit('preview', rendered)

  const baseData = { id, componentId, path: filePath, content, raw, rendered, context, extension }
  const data = R.mergeAll([attributes, baseData])

  debug3(state, `Variant.fetchById(${id}):end`)

  return data
}

module.exports = {
  findVariantIds,
  fetchAll,
  fetchById
}
