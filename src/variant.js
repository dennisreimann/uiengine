const path = require('path')
const R = require('ramda')
const glob = require('globby')
const markdown = require('./util/markdown')
const frontmatter = require('./util/frontmatter')
const VariantUtil = require('./util/variant')
const File = require('./util/file')
const Connector = require('./connector')

const assocVariant = (variants, variant) =>
  R.assoc(variant.id, variant, variants)

async function readVariantFile (state, filePath) {
  const { source } = state.config
  const variantName = path.basename(filePath, path.extname(filePath))
  const variantFile = path.join(path.dirname(filePath), `${variantName}.md`)
  const variant = await frontmatter.fromFile(variantFile, source)

  if (variant) {
    const { attributes, body } = variant
    const content = await markdown.fromString(body)

    return { attributes, content }
  } else {
    // no variant file
    return { attributes: {} }
  }
}

async function findVariantIds (state, componentPath = '**') {
  const { components } = state.config.source
  if (!components) return []

  const variantsPath = VariantUtil.componentIdToVariantsPath(components, componentPath)
  const pattern = path.join(variantsPath, '*')
  const excludePattern = '!' + path.join(variantsPath, '*.md')
  const variantPaths = await glob([pattern, excludePattern])

  const variantFilePathToVariantId = R.partial(VariantUtil.variantFilePathToVariantId, [components])
  const variantIds = R.map(variantFilePathToVariantId, variantPaths)

  return variantIds
}

async function fetchAll (state) {
  const componentsPath = state.config.source.components
  if (!componentsPath) return {}

  const variantIds = await findVariantIds(state)

  const variantFetch = R.partial(fetchById, [state])
  const variantFetches = R.map(variantFetch, variantIds)
  const variantList = await Promise.all(variantFetches)

  const variants = R.reduce(assocVariant, {}, variantList)

  return variants
}

async function fetchById (state, id) {
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
  const rawTemplate = File.read(filePath)
  const renderTemplate = Connector.render(state, filePath, context)
  const [raw, rendered] = await Promise.all([rawTemplate, renderTemplate])

  const baseData = { id, componentId, path: filePath, content, raw, rendered, context, extension }
  const data = R.mergeAll([attributes, baseData])

  return data
}

module.exports = {
  findVariantIds,
  fetchAll,
  fetchById
}
