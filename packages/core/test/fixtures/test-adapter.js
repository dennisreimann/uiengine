async function setup (options) {
  return new Promise((resolve, reject) => {
    resolve()
  })
}

async function registerComponentFile (options, filePath) {
  return new Promise((resolve, reject) => {
    resolve()
  })
}

async function render (options, templatePath, data = {}) {
  return new Promise((resolve, reject) => {
    resolve(`${templatePath} ${options.themeId} ${JSON.stringify(data)}`)
  })
}

async function filesForComponent (options, componentName) {
  return new Promise((resolve, reject) => {
    resolve([
      {
        basename: `${componentName}.test`,
        data: `${componentName}()`
      }
    ])
  })
}

async function filesForVariant (options, componentName, variantName) {
  return new Promise((resolve, reject) => {
    resolve([
      {
        basename: `${variantName}.test`,
        data: `${componentName}()`
      }
    ])
  })
}

module.exports = {
  setup,
  registerComponentFile,
  render,
  filesForComponent,
  filesForVariant
}
