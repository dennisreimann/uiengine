const { basename, join } = require('path')
const R = require('ramda')
const glob = require('globby')
const Connector = require('./connector')

const {
  DebugUtil: { debug2, debug3 },
  MessageUtil: { markSample },
  VariantUtil: { componentIdToVariantsPath, variantIdToFilePath, variantIdToTitle },
  FileUtil: { extension: fileExtension, read: readFile }
} = require('@uiengine/util')

const mapIndexed = R.addIndex(R.map)

// convert list of filenames to list of objects
const convertUserProvidedVariants = list =>
  R.map(item => typeof item === 'string' ? { file: item } : item, list)

export async function findVariants (state, componentId) {
  const { components } = state.config.source
  if (!components) return []

  const variantsPath = componentIdToVariantsPath(components, componentId)
  const pattern = join(variantsPath, '*')
  const variantPaths = await glob(pattern)
  const variants = R.map(variantPath => ({ file: basename(variantPath) }), variantPaths)

  return variants
}

export async function fetchObjects (state, componentId, context, variants) {
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
  const fetches = mapIndexed(fetch, variants)
  const list = await Promise.all(fetches)

  debug2(state, `Variant.fetchObjects(${componentId}):end`)

  return list
}

export async function fetchObject (state, componentId, componentContext, data, index) {
  const { file } = data

  const id = `${componentId}/${file}-${index + 1}`
  debug3(state, `Variant.fetchObject(${id}):start`)

  const { components } = state.config.source
  const filePath = variantIdToFilePath(components, id)
  const extension = fileExtension(filePath)
  const context = data.context || componentContext
  const title = data.title || variantIdToTitle(id)

  // render raw variant, without layout
  let raw, render
  const readTemplate = readFile(filePath)
  const renderTemplate = Connector.render(state, filePath, context)

  try {
    [raw, render] = await Promise.all([readTemplate, renderTemplate])
  } catch (err) {
    const message = [`Variant "${id}" could not be rendered!`, err]

    if (state.config.debug) message.push(markSample(JSON.stringify(context, null, 2)))

    throw new Error(message.join('\n\n'))
  }

  const fixData = { id, componentId, title, file, extension, raw, context }
  const variant = R.mergeAll([data, fixData, render])

  debug3(state, `Variant.fetchObject(${id}):end`)

  return variant
}
