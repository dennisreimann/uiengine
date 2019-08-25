const { FileUtil: { requireUncached } } = require('@uiengine/util')
const { getBuildId, debug } = require('../util')
const { white, green, red } = require('chalk')
const cache = require('../cache')

const getExtractProperties = options => {
  const { properties } = options
  if (['prop-types', 'vue'].includes(properties)) {
    const extractProperties = require(`./${properties}`)

    return (opts, filePath) => {
      // expect build result to be in cache, as registerFileComponent should
      // alwas have been run before and cache should be prefilled with result.
      const buildId = getBuildId(opts)
      const cached = cache.get(buildId, filePath)

      if (cached.properties) {
        debug(options, `extractProperties(${white(filePath)}) ${white('->')} ${green('properties cache hit')}`)
      } else {
        debug(options, `extractProperties(${white(filePath)}) ${white('->')} ${red('properties cache miss')}`)

        const { serverPath } = cached
        const ServerComponent = requireUncached(serverPath)
        cached.properties = ServerComponent
          ? extractProperties(filePath, ServerComponent)
          : {}
      }

      return cached.properties
    }
  } else {
    // return no op function
    return () => ({})
  }
}

module.exports = {
  getExtractProperties
}
