const { join, relative, resolve } = require('path')
const R = require('ramda')
const Interface = require('./interface')
const Connector = require('./connector')
const {
  UiengineInputError,
  PageUtil: { isTokensPage, pageIdToPath },
  FileUtil: { copy, write },
  MessageUtil: { markSample },
  StringUtil: { dasherize, replaceTemplateComments },
  DebugUtil: { debug2, debug3, debug4 }
} = require('@uiengine/util')

const copyPageFile = (targetPath, sourcePath, source) => {
  const filePath = relative(sourcePath, source)
  const target = resolve(targetPath, filePath)

  return copy(source, target)
}

const withThemes = async (themes, task, includingAll = false) => {
  const tasks = themes.map(({ id: themeId }) => task(themeId))
  if (includingAll) tasks.push(task('_all'))

  return Promise.all(tasks)
}

async function render (state, template, data, themeId, identifier) {
  debug4(state, `Builder.render(${template}, ${themeId}):start`)

  const { templates } = state.config.source
  if (!templates) throw new UiengineInputError('Templates source directory must be defined!')
  const templatePath = join(templates, template)

  let rendered
  try {
    rendered = await Connector.render(state, templatePath, data, themeId)
  } catch (err) {
    const message = [`${identifier} could not be generated!`]

    if (state.config.debug) message.push(markSample(JSON.stringify(data, null, 2)))

    throw new UiengineInputError(message, err)
  }

  debug4(state, `Builder.render(${template}, ${themeId}):end`)

  return rendered
}

async function generatePageFiles (state, pageId) {
  debug4(state, `Builder.generatePageFiles(${pageId}):start`)

  const { pages, config } = state
  const page = pages[pageId]

  if (!page.files) return

  const targetPagePath = page.path
  const sourcePagePath = pageIdToPath(page.id)
  const targetPath = join(config.target, targetPagePath)
  const sourcePath = join(config.source.pages, sourcePagePath)
  const copyFile = R.partial(copyPageFile, [targetPath, sourcePath])
  const copyFiles = R.map(copyFile, page.files)

  await Promise.all(copyFiles)

  debug4(state, `Builder.generatePageFiles(${pageId}):start`)
}

async function generatePageWithTemplate (state, pageId) {
  debug2(state, `Builder.generatePageWithTemplate(${pageId}):start`)

  const { pages, config: { target, themes, name, version } } = state
  const identifier = `Page "${pageId}"`
  const page = pages[pageId]

  if (!page) {
    throw new UiengineInputError(`${identifier} does not exist or has not been fetched yet.`)
  }

  if (page.template) {
    await withThemes(themes, async themeId => {
      // render template with context
      const { id, context, template } = page
      let { rendered, foot } = await render(state, template, context, themeId, identifier)
      rendered = replaceTemplateComments(rendered, {
        'class': `uie-page uie-page--${dasherize(id)}`,
        'title': `${page.title} • ${name} (${version})`,
        'theme': themeId,
        'content': rendered,
        'foot': foot
      })

      // write file
      const filePath = resolve(target, '_pages', themeId, `${id}.html`)
      return write(filePath, rendered)
    })
  }

  debug2(state, `Builder.generatePageWithTemplate(${pageId}):end`)
}

async function generatePagesWithTemplate (state, template) {
  debug3(state, `Builder.generatePagesWithTemplate(${template}):start`)

  const affectedPages = R.filter(page => page.template === template, state.pages)
  const pageIds = Object.keys(affectedPages)
  const build = R.partial(generatePageWithTemplate, [state])
  const builds = R.map(build, pageIds)

  await Promise.all(builds)

  debug3(state, `Builder.generatePagesWithTemplate(${template}):end`)
}

async function generatePageWithTokens (state, pageId) {
  debug2(state, `Builder.generatePageWithTokens(${pageId}):start`)

  const { pages, config } = state
  const { name, target, themes, version } = config
  const identifier = `Page "${pageId}"`
  const page = pages[pageId]

  if (!page) {
    throw new UiengineInputError(`${identifier} does not exist or has not been fetched yet.`)
  }

  if (isTokensPage(page.type)) {
    // render tokens with context, in preview layout
    const { id, title } = page
    const data = page
    const template = page.template || config.template

    await withThemes(themes, async themeId => {
      let { rendered, foot } = await render(state, template, data, themeId, identifier)
      const content = await Interface.render(state, 'tokens', page, themeId)
      rendered = replaceTemplateComments(rendered, {
        'class': `uie-tokens uie-tokens--${dasherize(id)}`,
        'title': `${title} • ${name} (${version})`,
        'theme': themeId,
        'content': content,
        'foot': foot
      })

      // write file
      const filePath = resolve(target, '_tokens', themeId, `${id}.html`)
      await write(filePath, rendered)
    }, true)
  }

  debug2(state, `Builder.generatePageWithTokens(${pageId}):end`)
}

async function generateVariant (state, variant) {
  const { id, componentId } = variant
  debug2(state, `Builder.generateVariant(${id}):start`)

  const { config, components } = state
  const { target, themes, name, version } = config
  const identifier = `Variant "${id}"`
  const component = components[componentId]

  // render variant preview, with layout
  const data = { state }
  const template = variant.template || component.template || config.template

  await withThemes(themes, async themeId => {
    let { rendered } = await render(state, template, data, themeId, identifier)
    const { rendered: content, foot } = variant.themes[themeId]
    rendered = replaceTemplateComments(rendered, {
      'class': `uie-variant uie-variant--${dasherize(componentId)} uie-variant--${dasherize(id)}`,
      'title': `${component.title}: ${variant.title} • ${name} (${version})`,
      'theme': themeId,
      'content': content,
      'foot': foot
    })

    // write file
    const filePath = resolve(target, '_variants', themeId, `${id}.html`)
    return write(filePath, rendered)
  })

  debug2(state, `Builder.generateVariant(${id}):end`)
}

async function generateComponentVariants (state, componentId) {
  debug3(state, `Builder.generateComponentVariants(${componentId}):start`)

  const component = state.components[componentId]
  const variants = component.variants || []
  const build = R.partial(generateVariant, [state])
  const builds = R.map(build, variants)
  await Promise.all(builds)

  debug3(state, `Builder.generateComponentVariants(${componentId}):end`)
}

async function generateVariantsWithTemplate (state, template) {
  debug3(state, `Builder.generateVariantsWithTemplate(${template}):start`)

  const components = Object.values(state.components)
  const isPreviewTemplate = template === state.config.template
  const affectedVariants = R.reduce((list, component) => {
    return R.concat(list, R.filter(variant => {
      // the variant must be regenerated in two cases:
      // 1.) the template is the general preview template and
      //     the variant does not use a custom template
      // 2.) the template matches the variant template
      return (isPreviewTemplate && variant.template === undefined) ||
        variant.template === template
    }, component.variants))
  }, [], components)
  const build = R.partial(generateVariant, [state])
  const builds = R.map(build, affectedVariants)

  await Promise.all(builds)

  debug3(state, `Builder.generateVariantsWithTemplate(${template}):end`)
}

async function generateTokensWithTemplate (state, template) {
  debug3(state, `Builder.generateTokensWithTemplate(${template}):start`)

  const isPreviewTemplate = template === state.config.template
  const affectedPages = R.filter(page => {
    // the page must be regenerated in two cases:
    // 1.) the template is the general preview template and
    //     the variant does not use a custom template
    // 2.) the template matches the page template
    return isTokensPage(page.type) &&
      (
        (isPreviewTemplate && page.template === undefined) ||
        page.template === template
      )
  }, state.pages)
  const pageIds = Object.keys(affectedPages)
  const build = R.partial(generatePageWithTokens, [state])
  const builds = R.map(build, pageIds)

  await Promise.all(builds)

  debug3(state, `Builder.generateTokensWithTemplate(${template}):end`)
}

async function generateStateHTML (state) {
  debug3(state, 'Builder.generateStateHTML():start')

  const data = { state }
  const rendered = await Interface.render(state, 'index', data)
  const filePath = resolve(state.config.target, 'index.html')
  await write(filePath, rendered)

  debug3(state, 'Builder.generateStateHTML():end')
}

async function generateStateJSON (state) {
  debug3(state, 'Builder.generateStateJSON():start')

  const json = JSON.stringify(state, null, 2)
  const filePath = resolve(state.config.target, '_state.json')
  await write(filePath, json)

  debug3(state, 'Builder.generateStateJSON():end')
}

async function generateState (state) {
  debug2(state, 'Builder.generateState():start')

  await Promise.all([
    generateStateHTML(state),
    generateStateJSON(state)
  ])

  debug2(state, 'Builder.generateState():end')
}

// generateIncrement is a better name for the public function,
// whereas generateState describes it better internally
const generateIncrement = generateState

async function generateSketch (state) {
  debug2(state, `Builder.generateSketch():start`)

  const { config: { name, target, template, version, themes, source: { templates } } } = state
  const identifier = 'HTML Sketchapp Export'

  if (templates && template) {
    // render variant preview, with layout
    const data = { state }

    await withThemes(themes, async themeId => {
      let { rendered, foot } = await render(state, template, data, themeId, identifier)
      const content = await Interface.render(state, 'sketch', data, themeId)
      rendered = replaceTemplateComments(rendered, {
        'class': 'uie-html-sketchapp',
        'title': `HTML Sketchapp Export ${themeId} • ${name} (${version})`,
        'theme': themeId,
        'content': content,
        'foot': foot
      })

      // write file
      const filePath = resolve(target, '_sketch', `${themeId}.html`)
      return write(filePath, rendered)
    })
  }

  debug2(state, `Builder.generateSketch():end`)
}

async function generate (state) {
  debug2(state, 'Builder.generate():start')

  const pageIds = Object.keys(state.pages)
  const variants = R.reduce((list, component) => {
    return R.concat(list, component.variants)
  }, [], Object.values(state.components))

  const templateBuild = R.partial(generatePageWithTemplate, [state])
  const templateBuilds = R.map(templateBuild, pageIds)

  const tokenBuild = R.partial(generatePageWithTokens, [state])
  const tokenBuilds = R.map(tokenBuild, pageIds)

  const fileBuild = R.partial(generatePageFiles, [state])
  const fileBuilds = R.map(fileBuild, pageIds)

  const variantBuild = R.partial(generateVariant, [state])
  const variantBuilds = R.map(variantBuild, variants)

  await Promise.all([
    ...fileBuilds,
    ...tokenBuilds,
    ...variantBuilds,
    ...templateBuilds,
    generateSketch(state),
    generateState(state)
  ])

  debug2(state, 'Builder.generate():end')
}

module.exports = {
  generate,
  generateIncrement,
  generateComponentVariants,
  generatePageFiles,
  generatePageWithTemplate,
  generatePagesWithTemplate,
  generatePageWithTokens,
  generateVariant,
  generateVariantsWithTemplate,
  generateTokensWithTemplate
}
