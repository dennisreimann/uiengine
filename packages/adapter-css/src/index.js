const { extractThemeProperties } = require('./theme')

async function registerComponentFile (options, filePath) {
  const themeProperties = await extractThemeProperties(options, filePath)

  const info = {}
  if (themeProperties.length > 0) info.themeProperties = themeProperties

  return info
}

function filesForComponent (componentName) {
  return [
    {
      basename: `${componentName}.css`,
      data: `.${componentName} {\n  /* TODO: implement */\n}\n`
    }
  ]
}

module.exports = {
  registerComponentFile,
  filesForComponent
}
