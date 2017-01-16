const Configuration = require('../../lib/configuration')
const testConfigPath = './test/project/project.yml'

async function fetchState () {
  const config = await Configuration.read(testConfigPath)
  const state = { config }

  return state
}

module.exports = fetchState
