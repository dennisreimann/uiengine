const { basename, dirname, join } = require('path')
const { readFile } = require('fs-extra')
const glob = require('globby')
const merge = require('deepmerge')
const postcss = require('postcss')
const { StringUtil: { crossPlatformPath } } = require('@uiengine/util')

const extractVarDefinition = value => {
  const match = value.match(/var\((.*?)(,\s?(.*))?\)/)
  if (match) {
    const [, variable,, values] = match
    const fallbacks = values ? values.split(',') : []
    return { variable, fallbacks }
  }
  return {}
}

const customPropToName = varName =>
  varName
    .split(/\W+/gi)
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')
    .trim()

async function propsByThemeFromDir (dir) {
  const pattern = crossPlatformPath(join(dir, '*.css'))
  const themePaths = await glob(pattern, { onlyFiles: true })
  const propsByTheme = {}

  for (const themePath of themePaths) {
    const id = basename(themePath, '.css')
    propsByTheme[id] = await extractCustomProperties(themePath)
  }
  return propsByTheme
}

async function extractCustomProperties (filePath) {
  const contents = await readFile(filePath, 'utf-8')
  const root = postcss.parse(contents, { from: filePath })
  const customProps = {}

  root.walkDecls(node => {
    const { prop, value } = node
    if (prop.startsWith('--')) {
      const prev = node.prev()
      const comment = prev && prev.type === 'comment' ? prev.text : undefined
      const { variable, fallbacks } = extractVarDefinition(value)

      customProps[prop] = {
        prop,
        value,
        comment,
        variable,
        fallbacks
      }
    }
  })

  return customProps
}

async function extractThemeProperties (options, filePath) {
  const globalThemesDir = options.globalThemesDir
  const themesDir = options.componentThemesDir || 'themes'
  const themeIds = options.themeIds || []
  const customProps = await extractCustomProperties(filePath)
  if (Object.keys(customProps).length === 0) return []

  // resolve component and global properties for each theme
  const componentThemesDir = join(dirname(filePath), themesDir)
  const [localPropsByTheme, globalPropsByTheme] = await Promise.all([
    propsByThemeFromDir(componentThemesDir),
    globalThemesDir ? propsByThemeFromDir(globalThemesDir) : {}
  ])
  const propsByTheme = merge(globalPropsByTheme, localPropsByTheme)

  // build theme properties data structure based on custom props
  const result = []
  Object.keys(customProps).map(customPropVarName => {
    const {
      prop,
      value,
      comment,
      variable
    } = customProps[customPropVarName]

    // infer name from variable if there is no comment
    const name = comment || customPropToName(customPropVarName)

    // infer type based on name
    const type = prop.match('color') ? 'color' : undefined

    // if the value itself is a variable, try to resolve the value
    // by looking up previous custom property definitions
    let defaultValue = value
    if (variable) {
      const propForVar = result.find(prop => prop.variable === variable)
      defaultValue = propForVar && propForVar.default && propForVar.default.value
    }

    const _default = {
      variable,
      value: defaultValue
    }

    const themes = themeIds.reduce((themeResult, themeId) => {
      const themeProps = propsByTheme[themeId]
      const customProp = themeProps && themeProps[customPropVarName]
      let info = _default
      if (customProp) {
        // if the value itself is a variable, try to resolve the value
        // by looking up previous custom property definitions
        let cpVal = customProp.value
        const cpVar = customProp.variable
        if (cpVar) {
          // first look up in the component set, then fall back to the theme set
          const componentPropForVar = result.find(prop => prop.variable === variable)
          const themePropForVar = themeProps[cpVar]
          if (componentPropForVar) {
            cpVal = componentPropForVar && componentPropForVar.default && componentPropForVar.default.value
          } else if (themePropForVar) {
            cpVal = themePropForVar.value
          } else {
            cpVal = undefined
          }
        }

        info = {
          variable: cpVar,
          value: cpVal
        }
      }

      return Object.assign(themeResult, { [themeId]: info })
    }, {})

    const info = {
      type,
      name,
      variable: prop,
      default: _default,
      themes
    }

    result.push(info)
  })

  return result
}

module.exports = {
  extractThemeProperties
}
