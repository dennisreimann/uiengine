const nunjucks = require('nunjucks')

async function setup (options) {
  const { components, loader, env } = options

  if (!components) return

  const searchPaths = options.searchPaths || components
  const nunjucksLoader =
    loader || new nunjucks.FileSystemLoader(searchPaths, options)
  const nunjucksEnv =
    env || new nunjucks.Environment(nunjucksLoader, options)

  const addGlobals = function (globals) {
    for (const name in globals) {
      nunjucksEnv.addGlobal(name, globals[name])
    }
  }

  const addFilters = function (helpers, isAsync) {
    for (const name in helpers) {
      nunjucksEnv.addFilter(name, helpers[name], isAsync)
    }
  }

  addGlobals(options.globals)
  addFilters(options.filters)
  addFilters(options.asyncFilters, true)

  return nunjucksEnv
}

async function render (options, filePath, data = {}) {
  const env = await setup(options)

  return new Promise((resolve, reject) => {
    env.render(filePath, data, (error, rendered) => {
      if (error) {
        reject(error)
      } else {
        resolve(rendered)
      }
    })
  })
}

function filesForComponent (options, componentName) {
  return [
    {
      basename: `${componentName}.njk`,
      data: `{% macro ${componentName}(args) %}\n  <div class="${componentName}">\n  <!-- TODO: implement -->\n</div>\n{% endmacro %}`
    }
  ]
}

function filesForVariant (options, componentName, variantName) {
  return [
    {
      basename: `${variantName}.njk`,
      data: `{% from '../${componentName}.njk' import ${componentName} %}\n\n{{ ${componentName} }}`
    }
  ]
}

module.exports = {
  setup,
  render,
  filesForComponent,
  filesForVariant
}
