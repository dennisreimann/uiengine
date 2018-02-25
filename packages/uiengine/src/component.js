const { resolve } = require('path')
const R = require('ramda')
const glob = require('globby')
const frontmatter = require('./util/frontmatter')
const markdown = require('./util/markdown')
const ComponentUtil = require('./util/component')
const Variant = require('./variant')
const { debug2, debug3, debug4, debug5 } = require('./util/debug')

async function readComponentFile (state, filePath) {
  debug4(state, `Component.readComponentFile(${filePath}):start`)

  const { source } = state.config
  let data = { attributes: {} } // in case there is no component file

  try {
    const component = await frontmatter.fromFile(filePath, source)
    const { attributes, body } = component
    const content = await markdown.fromString(body)

    data = { attributes, content }
  } catch (err) {
    debug5(state, 'Could not read component file', filePath, err)
  }

  debug4(state, `Component.readComponentFile(${filePath}):end`)

  return data
}

async function findComponentIds (state) {
  const { components } = state.config.source
  if (!components) return []

  const pattern = resolve(components, '*')
  const componentPaths = await glob(pattern, { nodir: false })
  const componentIdFromComponentPath = R.partial(ComponentUtil.componentPathToComponentId, [components])
  const componentIds = R.map(componentIdFromComponentPath, componentPaths)

  return componentIds
}

async function fetchAll (state) {
  debug2(state, `Component.fetchAll():start`)

  const componentIds = await findComponentIds(state)
  const fetch = R.partial(fetchById, [state])
  const fetches = R.map(fetch, componentIds)
  const list = await Promise.all(fetches)
  const components = R.reduce((components, component) => R.assoc(component.id, component, components), {}, list)

  debug2(state, `Component.fetchAll():end`)

  return components
}

async function fetchById (state, id) {
  debug3(state, `Component.fetchById(${id}):start`)

  const componentsPath = state.config.source.components
  const componentPath = ComponentUtil.componentIdToPath(id)
  const componentFilePath = ComponentUtil.componentIdToComponentFilePath(componentsPath, id)
  const componentData = await readComponentFile(state, componentFilePath)

  let { attributes, content, attributes: { context, variants } } = componentData
  variants = await Variant.fetchObjects(state, id, context, variants)

  const title = ComponentUtil.componentIdToTitle(id)
  const baseData = { title }
  const fixData = { id, content, variants, path: componentPath, type: 'component' }
  const data = R.mergeAll([baseData, attributes, fixData])

  debug3(state, `Component.fetchById(${id}):end`)

  return data
}

module.exports = {
  fetchAll,
  fetchById
}
