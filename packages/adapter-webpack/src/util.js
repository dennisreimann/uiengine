const { join, relative, sep: MEMORY_PATH } = require('path')
const hash = require('object-hash')
const webpack = require('webpack')
const MemoryFS = require('memory-fs')
const requireFromString = require('require-from-string')
const { DebounceUtil: { debounce } } = require('@uiengine/util')
const { cacheGet, cachePut, cacheDel } = require('./cache')

const QUEUES = {}
const MEMORY_FS = new MemoryFS()
const WEBPACK_NAME_SERVER = 'server'
const WEBPACK_NAME_CLIENT = 'client'

const getFileId = (filePath, type) =>
  relative(process.cwd(), filePath).replace(/[^\w\s]/gi, '_') + `-${type}`

// queue ids separate different adapter types, as in one project multiple
// file types (i.e. react and vue) can be build with the webpack adapter.
// -> one queue per file type
const getQueueId = options => `webpack-${hash(options)}`

const readFromMemory = (filePath, type) => {
  const memPath = join(MEMORY_PATH, `${getFileId(filePath, type)}.js`)
  return MEMORY_FS.readFileSync(memPath, 'utf-8')
}

const requireFromMemory = (filePath, type) => {
  const jsString = readFromMemory(filePath, type)
  let Element = requireFromString(jsString, filePath)
  return Element
}

const buildConfig = options => {
  const { serverConfig, clientConfig } = options
  const config = {}

  // build webpack config by overriding entry and output
  // and explicitely setting the target
  if (serverConfig) {
    config.server = Object.assign({}, serverConfig, {
      name: WEBPACK_NAME_SERVER,
      target: 'node',
      entry: {},
      output: {
        path: MEMORY_PATH,
        filename: '[name].js',
        libraryTarget: 'commonjs2'
      }
    })
  }

  if (clientConfig) {
    config.client = Object.assign({}, clientConfig, {
      name: WEBPACK_NAME_CLIENT,
      target: 'web',
      entry: {},
      output: {
        path: MEMORY_PATH,
        filename: '[name].js'
      }
    })
  }

  return config
}

const addFileToQueue = (options, filePath, queue) => {
  if (queue.promises[filePath]) return queue.promises[filePath]

  const { serverConfig, serverRenderPath, clientConfig, clientRenderPath } = options
  const serverId = getFileId(filePath, 'serverComponent')
  const clientId = getFileId(filePath, 'clientComponent')

  if (serverConfig) {
    queue.config.server.entry[serverId] = filePath
    queue.config.server.entry[getFileId(filePath, 'serverRender')] = serverRenderPath
  }

  if (clientConfig) {
    queue.config.client.entry[clientId] = filePath
    queue.config.client.entry[getFileId(filePath, 'clientRender')] = clientRenderPath
  }

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
    compiler.outputFileSystem = MEMORY_FS
    compiler.run((error, stats) => (error ? reject(error) : resolve(stats)))
  })

const runWebpack = async config => {
  const compiler = webpack(Object.values(config))

  // https://webpack.js.org/api/node#error-handling
  const stats = await compile(compiler)
  const { warnings, errors } = stats.toJson('errors-warnings')

  if (warnings.length) console.warn(warnings.join('\n'))
  if (errors.length) throw new Error(errors.join('\n'))

  return stats
}

const getExtractProperties = (options, filePath) => {
  let { properties } = options
  if (['prop-types', 'vue'].includes(properties)) {
    const extractProperties = require(`./props/${properties}`)
    return async (opts, file) => {
      const { serverComponent } = await buildQueued(opts, file)
      return serverComponent ? extractProperties(file, serverComponent) : {}
    }
  } else {
    // return no op function
    return () => ({})
  }
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

      Object.values(handles).forEach(({ resolve, filePath, serverId, clientId }) => {
        const serverChunk = serverInfo && serverInfo.chunks.find(chunk => chunk.id === serverId)
        const clientChunk = clientInfo && clientInfo.chunks.find(chunk => chunk.id === clientId)
        const serverRender = serverChunk && requireFromMemory(filePath, 'serverRender')
        const serverComponent = serverChunk && requireFromMemory(filePath, 'serverComponent')
        const clientRender = clientChunk && readFromMemory(filePath, 'clientRender')
        const clientComponent = clientChunk && readFromMemory(filePath, 'clientComponent')

        const object = {
          filePath,
          serverId,
          serverChunk,
          serverRender,
          serverComponent,
          clientId,
          clientChunk,
          clientRender,
          clientComponent
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
  readFromMemory,
  requireFromMemory,
  buildQueued,
  getExtractProperties
}
