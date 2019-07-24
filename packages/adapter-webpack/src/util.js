const { join, relative } = require('path')
const hash = require('object-hash')
const webpack = require('webpack')
const merge = require('webpack-merge')
const { DebounceUtil: { debounce } } = require('@uiengine/util')
const { cacheGet, cachePut, cacheDel } = require('./cache')

const QUEUES = {}
const TARGET_FOLDER = '_webpack'
const WEBPACK_NAME_SERVER = 'server'
const WEBPACK_NAME_CLIENT = 'client'

const getFileId = (filePath, type) =>
  relative(process.cwd(), filePath).replace(/[^\w\s]/gi, '_') + `-${type}`

const filesDir = ({ target }) => join(target, TARGET_FOLDER)

// queue ids separate different adapter types, as in one project multiple
// file types (i.e. react and vue) can be build with the webpack adapter.
// -> one queue per file type
const getQueueId = options => `webpack-${hash(options)}`

const buildConfig = (options, isSetupBuild = false) => {
  const { ext, serverConfig, serverRenderPath, clientConfig, clientRenderPath } = options
  const config = {}

  // deliberately skip optimizations
  const mode = 'development'

  // build webpack config by overriding entry and output
  // and explicitely setting the target
  if (serverConfig && serverRenderPath) {
    const entry = isSetupBuild
      ? { [`${ext}-server`]: serverRenderPath }
      : {}

    config.server = merge(serverConfig, {
      name: WEBPACK_NAME_SERVER,
      target: 'node',
      mode,
      entry,
      output: {
        path: filesDir(options),
        filename: '[name].js',
        libraryTarget: 'commonjs2'
      }
    })
  }

  if (clientConfig && clientRenderPath) {
    const entry = isSetupBuild
      ? { [`${ext}-client`]: clientRenderPath }
      : {}
    const library = isSetupBuild
      ? 'UIengineWebpack_render'
      : 'UIengineWebpack_component'

    config.client = merge(clientConfig, {
      name: WEBPACK_NAME_CLIENT,
      target: 'web',
      mode,
      entry,
      output: {
        path: filesDir(options),
        filename: '[name].js',
        library,
        libraryTarget: 'window',
        libraryExport: 'default'
      }
    })
  }

  return config
}

const addFileToQueue = (options, filePath, queue) => {
  if (queue.promises[filePath]) return queue.promises[filePath]

  const { serverConfig, clientConfig } = options
  const serverId = getFileId(filePath, 'server')
  const clientId = getFileId(filePath, 'client')

  if (serverConfig) queue.config.server.entry[serverId] = filePath
  if (clientConfig) queue.config.client.entry[clientId] = filePath

  // cache the promises so that files do not get added multiple times
  const promise = new Promise((resolve, reject) => {
    queue.handles[filePath] = {
      reject,
      resolve,
      filePath,
      serverId,
      clientId
    }
  })

  queue.promises[filePath] = promise

  return promise
}

const compile = compiler =>
  new Promise((resolve, reject) => {
    compiler.run((error, stats) => (error ? reject(error) : resolve(stats)))
  })

// TODO: Evaluate parallel-webpack
// https://www.npmjs.com/package/parallel-webpack#nodejs-api
const runWebpack = async config => {
  const compiler = webpack(Object.values(config))

  // https://webpack.js.org/api/node#error-handling
  const stats = await compile(compiler)
  const { warnings, errors } = stats.toJson('errors-warnings')

  if (warnings.length) console.warn(warnings.join('\n'))
  if (errors.length) throw new Error(errors.join('\n'))

  return stats
}

const getExtractProperties = options => {
  const { properties } = options
  if (['prop-types', 'vue'].includes(properties)) {
    const extractProperties = require(`./props/${properties}`)
    return async (opts, file) => {
      const { serverComponentPath } = await buildQueued(opts, file)
      const ServerComponent = require(serverComponentPath)
      return ServerComponent ? extractProperties(file, ServerComponent) : {}
    }
  } else {
    // return no op function
    return () => ({})
  }
}

async function buildSetup (options) {
  const config = buildConfig(options, true)
  await runWebpack(config)
}

async function buildQueued (options, filePath, clearCache = false) {
  const queueId = getQueueId(options)

  if (clearCache) {
    cacheDel(queueId, filePath)
  } else {
    const cached = cacheGet(queueId, filePath)
    if (cached) return cached
  }

  if (!QUEUES[queueId]) {
    QUEUES[queueId] = {
      config: buildConfig(options),
      handles: {},
      promises: {}
    }
  }

  const promise = addFileToQueue(options, filePath, QUEUES[queueId])

  debounce(queueId, async () => {
    const { config, handles } = QUEUES[queueId]
    delete QUEUES[queueId]

    try {
      const stats = await runWebpack(config)
      const info = stats.toJson()
      const serverInfo = info.children.find(child => child.name === WEBPACK_NAME_SERVER)
      const clientInfo = info.children.find(child => child.name === WEBPACK_NAME_CLIENT)
      const { ext, uiBase } = options

      Object.values(handles).forEach(({ resolve, filePath, serverId, clientId }) => {
        const serverChunk = serverInfo && serverInfo.chunks.find(chunk => chunk.id === serverId)
        const clientChunk = clientInfo && clientInfo.chunks.find(chunk => chunk.id === clientId)
        const serverRenderPath = serverChunk && join(filesDir(options), `${ext}-server.js`)
        const serverComponentPath = serverChunk && join(filesDir(options), `${getFileId(filePath, 'server')}.js`)
        const clientRenderPath = clientChunk && `${uiBase}${TARGET_FOLDER}/${ext}-client.js`
        const clientComponentPath = clientChunk && `${uiBase}${TARGET_FOLDER}/${getFileId(filePath, 'client')}.js`

        // console.log(serverId, serverChunk, serverInfo.chunks)
        const object = {
          filePath,
          serverChunk,
          serverRenderPath,
          serverComponentPath,
          clientChunk,
          clientRenderPath,
          clientComponentPath
        }

        cachePut(queueId, filePath, object)

        resolve(object)
      })
    } catch (error) {
      Object.values(handles).forEach(({ reject }) => reject(error))
    }
  })

  return promise
}

module.exports = {
  buildSetup,
  buildQueued,
  getExtractProperties
}
