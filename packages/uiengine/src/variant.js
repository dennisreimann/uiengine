const { basename, join } = require('path')
const R = require('ramda')
const glob = require('globby')
const Connector = require('./connector')
const VariantUtil = require('./util/variant')
const File = require('./util/file')
const { error } = require('./util/message')
const { debug2, debug3 } = require('./util/debug')

const regexpClean = new RegExp('([\\s]*?<!--\\s?omit:.*?\\s?-->)', 'gi')

const omit = (mark, string) => {
  const regexpOmit = new RegExp(`([\\s]*?<!--\\s?omit:${mark}:start\\s?-->[\\s\\S]*?<!--\\s?omit:${mark}:end\\s?-->)`, 'gi')
  return string.replace(regexpOmit, '').replace(regexpClean, '')
}

// convert list of filenames to list of objects
const convertUserProvidedVariants = list =>
  R.map(item => typeof item === 'string' ? { file: item } : item, list)

async function findVariants (state, componentId) {
  const { components } = state.config.source
  if (!components) return []

  const variantsPath = VariantUtil.componentIdToVariantsPath(components, componentId)
  const pattern = join(variantsPath, '*')
  const variantPaths = await glob(pattern)
  const variants = R.map(variantPath => ({ file: basename(variantPath) }), variantPaths)

  return variants
}

async function fetchObjects (state, componentId, context, variants) {
  debug2(state, `Variant.fetchObjects(${componentId}):start`)

  // variants might be populated from the component attributes.
  if (variants) {
    // ensure a list of objects, convert list of filenames
    variants = convertUserProvidedVariants(variants)
  } else {
    // look up variants from folder if they are not specified.
    variants = await findVariants(state, componentId)
  }

  const fetch = R.partial(fetchObject, [state, componentId, context])
  const fetches = R.map(fetch, variants)
  const list = await Promise.all(fetches)

  debug2(state, `Variant.fetchObjects(${componentId}):end`)

  return list
}

async function fetchObject (state, componentId, componentContext, data) {
  const { file } = data
  const id = `${componentId}/${file}`
  debug3(state, `Variant.fetchObject(${id}):start`)

  const { components } = state.config.source
  const filePath = VariantUtil.variantIdToVariantFilePath(components, id)
  const extension = File.extension(filePath)
  const context = data.context || componentContext
  const title = data.title || VariantUtil.variantIdToTitle(id)

  // render raw variant, without layout
  let raw, rendered
  const readTemplate = File.read(filePath)
  const renderTemplate = Connector.render(state, filePath, context)

  try {
    [raw, rendered] = await Promise.all([readTemplate, renderTemplate])
  } catch (err) {
    const message = [error(`Variant "${id}" could not be rendered!`), err]

    if (state.config.debug) message.push(JSON.stringify(context, null, 2))

    throw new Error(message.join('\n\n'))
  }

  // adjust raw and rendered: omit marked parts
  if (raw) raw = omit('code', raw)
  if (rendered) rendered = omit('preview', rendered)

  const fixData = { id, componentId, title, file, extension, raw, rendered, context }
  const variant = R.mergeAll([data, fixData])

  debug3(state, `Variant.fetchObject(${id}):end`)

  return variant
}

module.exports = {
  findVariants,
  fetchObjects,
  fetchObject
}
