export async function setup (options) {
  return new Promise((resolve, reject) => {
    resolve()
  })
}
export async function registerComponentFile (options, filePath) {
  return new Promise((resolve, reject) => {
    resolve()
  })
}

export async function render (options, templatePath, data = {}) {
  return new Promise((resolve, reject) => {
    resolve(`${templatePath} ${JSON.stringify(data)}`)
  })
}

export async function filesForComponent (componentName) {
  return new Promise((resolve, reject) => {
    resolve([
      {
        basename: `${componentName}.test`,
        data: `${componentName}()`
      }
    ])
  })
}

export async function filesForVariant (componentName, variantName) {
  return new Promise((resolve, reject) => {
    resolve([
      {
        basename: `${variantName}.test`,
        data: `${componentName}()`
      }
    ])
  })
}
