const { join, relative, sep: MEMORY_PATH } = require('path')
const hash = require('object-hash')
const webpack = require('webpack')
const MemoryFS = require('memory-fs')
const requireFromString = require('require-from-string')
const { DebounceUtil: { debounce } } = require('@uiengine/util')

const CACHES = {}
const QUEUES = {}
const MEMORY_FS = new MemoryFS()
const WEBPACK_NAME_SERVER = 'server'
const WEBPACK_NAME_CLIENT = 'client'

const getFileId = (filePath, type) =>
  relative(process.cwd(), filePath).replace(/[^\w\s]/gi, '_') + `-${type}`

const getQueueId = options => `webpack-${hash(options)}`

const readFromMemory = (filePath, type) => {
  const memPath = join(MEMORY_PATH, `${getFileId(filePath, type)}.js`)
  return MEMORY_FS.readFileSync(memPath, 'utf-8')
}

const requireFromMemory = (filePath, type) => {
  const jsString = readFromMemory(filePath, type)
  let Element = requireFromString(jsString, filePath)
  return Element.default || Element
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

function clearCache (options, filePath) {
  const queueId = getQueueId(options)

  if (CACHES[queueId] && CACHES[queueId][filePath]) {
    delete CACHES[queueId][filePath]
  }
}

async function buildQueued (options, filePath) {
  const queueId = getQueueId(options)

  if (CACHES[queueId] && CACHES[queueId][filePath]) return CACHES[queueId][filePath]

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

        CACHES[queueId] = CACHES[queueId] || {}
        CACHES[queueId][filePath] = object

        resolve(object)
      })
      // console.group(queueId)
      // console.log(Object.keys(handles))
      // console.groupEnd()
    } catch (error) {
      Object.values(handles).forEach(({ reject }) => reject(error))
    }
  })

  return promise
}

module.exports = {
  readFromMemory,
  requireFromMemory,
  clearCache,
  buildQueued
}
