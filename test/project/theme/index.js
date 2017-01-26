const path = require('path')

async function setup () {
  return new Promise((resolve, reject) => resolve())
}

async function render (templateId, data = {}) {
  return new Promise((resolve, reject) => {
    const rendered = `${templateId} -> ${JSON.stringify(data, null, '  ')}`

    resolve(rendered)
  })
}

async function teardown () {
  return new Promise((resolve, reject) => resolve())
}

module.exports = {
  assetsPath: path.resolve(__dirname, 'assets'),
  setup: setup,
  render: render,
  teardown: teardown
}
