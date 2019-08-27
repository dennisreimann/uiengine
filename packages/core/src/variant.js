const { basename, join } = require('path')
const R = require('ramda')
const glob = require('globby')
const Connector = require('./connector')
const { UiengineInputError } = require('@uiengine/util')

const {
  DebugUtil: { debug2, debug3 },
  MessageUtil: { markSample },
  VariantUtil: { componentIdToVariantsPath, variantIdToFilePath, variantIdToTitle },
  FileUtil: { extension: fileExtension, read: readFile, relativeToCwd }
} = require('@uiengine/util')

const mapIndexed = R.addIndex(R.map)

// convert list of filenames to list of objects
const convertUserProvidedVariants = list =>
  R.map(item => typeof item === 'string' ? { file: item } : item, list)

async function findVariants (state, componentId) {
  const { config: { adapters, source: { components } } } = state
  if (!components) return []

  // register only files with adapter extensions
  const variantsPath = componentIdToVariantsPath(components, componentId)
  const exts = Object.keys(adapters).join(',')
  const pattern = join(variantsPath, `*.{${exts}}`)
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
  const fetches = mapIndexed(fetch, variants)
  const list = await Promise.all(fetches)

  debug2(state, `Variant.fetchObjects(${componentId}):end`)

  return list
}

async function fetchObject (state, componentId, componentContext, data, index) {
  const { file } = data
  const id = `${componentId}/${file}-${index + 1}`
  debug3(state, `Variant.fetchObject(${id}):start`)

  const { source: { components } } = state.config
  const themeIds = R.pluck('id', state.config.themes)
  const filePath = variantIdToFilePath(components, id)
  const extension = fileExtension(filePath)
  const context = data.context || componentContext
  const title = data.title || variantIdToTitle(id)

  // render raw variant, without layout
  let raw, rendered
  const readTemplate = readFile(filePath)
  const renderThemes = themeIds.map(themeId => Connector.render(state, filePath, context, themeId, id))

  try {
    [raw, ...rendered] = await Promise.all([readTemplate, ...renderThemes])
  } catch (err) {
    const relativeFilePath = relativeToCwd(filePath)
    const message = [
      `Variant "${title}" could not be rendered!`,
      `Component: ${componentId}\nFile: ${relativeFilePath}`,
      err
    ]

    if (state.config.debug) message.push(markSample(JSON.stringify(context, null, 2)))

    throw new UiengineInputError(message, err)
  }

  const fixData = { id, componentId, title, file, extension, raw, context }
  const themes = R.zipObj(themeIds, rendered)
  const variant = R.mergeAll([data, fixData, { themes }])

  debug3(state, `Variant.fetchObject(${id}):end`)

  return variant
}

module.exports = {
  fetchObjects,
  fetchObject,
  findVariants
}
