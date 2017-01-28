const path = require('path')

async function render (templateId, data = {}) {
  return new Promise((resolve, reject) => {
    const rendered = `${templateId} -> ${JSON.stringify(data, null, '  ')}`

    resolve(rendered)
  })
}

module.exports = {
  assetsPath: path.resolve(__dirname, 'assets'),
  render: render
}
