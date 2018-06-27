const { join, relative, resolve } = require('path')
const R = require('ramda')
const Interface = require('./interface')
const Connector = require('./connector')
const File = require('./util/file')
const PageUtil = require('./util/page')
const { dasherize, replaceTemplateComments } = require('./util/string')
const { error } = require('./util/message')
const { debug2, debug3, debug4 } = require('./util/debug')

const copyPageFile = (targetPath, sourcePath, source) => {
  const filePath = relative(sourcePath, source)
  const target = resolve(targetPath, filePath)

  return File.copy(source, target)
}

async function render (state, template, data, identifier) {
  debug4(state, `Builder.render(${template}):start`)

  const templatePath = join(state.config.source.templates, template)

  let rendered
  try {
    rendered = await Connector.render(state, templatePath, data)
  } catch (err) {
    const message = [error(`${identifier} could not be generated!`), err]

    if (state.config.debug) message.push(JSON.stringify(data, null, 2))

    throw new Error(message.join('\n\n'))
  }

  debug4(state, `Builder.render(${template}):end`)

  return rendered
}

export async function generatePageFiles (state, pageId) {
  debug4(state, `Builder.generatePageFiles(${pageId}):start`)

  const { pages, config } = state
  const page = pages[pageId]

  if (!page.files) return

  const targetPagePath = page.path
  const sourcePagePath = PageUtil.pageIdToPath(page.id)
  const targetPath = join(config.target, targetPagePath)
  const sourcePath = join(config.source.pages, sourcePagePath)
  const copyFile = R.partial(copyPageFile, [targetPath, sourcePath])
  const copyFiles = R.map(copyFile, page.files)

  await Promise.all(copyFiles)

  debug4(state, `Builder.generatePageFiles(${pageId}):start`)
}

export async function generatePageWithTemplate (state, pageId) {
  debug2(state, `Builder.generatePageWithTemplate(${pageId}):start`)

  const { pages, config: { target } } = state
  const identifier = `Page "${pageId}"`
  const page = pages[pageId]
  if (!page) throw new Error(`${identifier} does not exist or has not been fetched yet.`)

  if (page.template) {
    // render template with context
    const { id, context, template } = page
    const { rendered } = await render(state, template, context, identifier)

    // write file
    const filePath = resolve(target, '_pages', `${id}.html`)
    await File.write(filePath, rendered)
  }

  debug2(state, `Builder.generatePageWithTemplate(${pageId}):end`)
}

export async function generatePagesWithTemplate (state, template) {
  debug3(state, `Builder.generatePagesWithTemplate(${template}):start`)

  const affectedPages = R.filter(page => page.template === template, state.pages)
  const pageIds = Object.keys(affectedPages)
  const build = R.partial(generatePageWithTemplate, [state])
  const builds = R.map(build, pageIds)

  await Promise.all(builds)

  debug3(state, `Builder.generatePagesWithTemplate(${template}):end`)
}

export async function generatePageWithTokens (state, pageId) {
  debug2(state, `Builder.generatePageWithTokens(${pageId}):start`)

  const { pages, config } = state
  const { name, target, version } = config
  const identifier = `Page "${pageId}"`
  const page = pages[pageId]
  if (!page) throw new Error(`${identifier} does not exist or has not been fetched yet.`)

  if (PageUtil.isTokensPage(page.type)) {
    // render tokens with context, in preview layout
    const { id, title } = page
    const data = page
    const template = page.template || config.template
    let { rendered } = await render(state, template, data, identifier)
    rendered = replaceTemplateComments(rendered, {
      'content': await Interface.render(state, 'tokens', page),
      'class': `uie-tokens uie-tokens--${dasherize(id)}`,
      'title': `${title} • ${name} (${version})`
    })

    // write file
    const filePath = resolve(target, '_tokens', `${id}.html`)
    await File.write(filePath, rendered)
  }

  debug2(state, `Builder.generatePageWithTokens(${pageId}):end`)
}

export async function generateVariant (state, variant) {
  debug2(state, `Builder.generateVariant(${variant.id}):start`)

  const { config, components } = state
  const identifier = `Variant "${variant.id}"`
  const component = components[variant.componentId]

  // render variant preview, with layout
  const data = { state }
  const template = variant.template || config.template
  let { rendered } = await render(state, template, data, identifier)
  rendered = replaceTemplateComments(rendered, {
    'content': variant.rendered,
    'class': `uie-variant uie-variant--${dasherize(variant.componentId)} uie-variant--${dasherize(variant.id)}`,
    'title': `${component.title}: ${variant.title} • ${config.name} (${config.version})`
  })

  // write file
  const filePath = resolve(config.target, '_variants', `${variant.id}.html`)
  await File.write(filePath, rendered)

  debug2(state, `Builder.generateVariant(${variant.id}):end`)
}

export async function generateComponentVariants (state, componentId) {
  debug3(state, `Builder.generateComponentVariants(${componentId}):start`)

  const component = state.components[componentId]
  const variants = component.variants || []
  const build = R.partial(generateVariant, [state])
  const builds = R.map(build, variants)
  await Promise.all(builds)

  debug3(state, `Builder.generateComponentVariants(${componentId}):end`)
}

export async function generateVariantsWithTemplate (state, template) {
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

export async function generateTokensWithTemplate (state, template) {
  debug3(state, `Builder.generateTokensWithTemplate(${template}):start`)

  const isPreviewTemplate = template === state.config.template
  const affectedPages = R.filter(page => {
    // the page must be regenerated in two cases:
    // 1.) the template is the general preview template and
    //     the variant does not use a custom template
    // 2.) the template matches the page template
    return PageUtil.isTokensPage(page.type) &&
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
  await File.write(filePath, rendered)

  debug3(state, 'Builder.generateStateHTML():end')
}

async function generateStateJSON (state) {
  debug3(state, 'Builder.generateStateJSON():start')

  const json = JSON.stringify(state, null, 2)
  const filePath = resolve(state.config.target, '_state.json')
  await File.write(filePath, json)

  debug3(state, 'Builder.generateStateJSON():end')
}

async function generateState (state) {
  debug2(state, 'Builder.generateState():start')

  const tasks = [generateStateHTML(state)]
  if (state.config.debug) tasks.push(generateStateJSON(state))
  await Promise.all(tasks)

  debug2(state, 'Builder.generateState():end')
}

// generateIncrement is a better name for the public function,
// whereas generateState describes it better internally
export const generateIncrement = generateState

async function generateSketch (state) {
  debug2(state, `Builder.generateSketch():start`)

  const { config: { name, target, template, version } } = state
  const identifier = 'HTML Sketchapp Export'

  // render variant preview, with layout
  const data = { state }
  let { rendered } = await render(state, template, data, identifier)
  rendered = replaceTemplateComments(rendered, {
    'content': await Interface.render(state, 'sketch', data),
    'class': 'uie-html-sketchapp',
    'title': `HTML Sketchapp Export • ${name} (${version})`
  })

  // write file
  const filePath = resolve(target, '_sketch.html')
  await File.write(filePath, rendered)

  debug2(state, `Builder.generateSketch():end`)
}

export async function generate (state) {
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
