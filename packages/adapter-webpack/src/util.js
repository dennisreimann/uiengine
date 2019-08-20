const { join, relative } = require('path')
const hash = require('object-hash')
const webpack = require('webpack')
const merge = require('webpack-merge')
const VirtualModulesPlugin = require('webpack-virtual-modules')
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

const buildConfig = options => {
  const { serverConfig, serverRenderPath, clientConfig, clientRenderPath } = options
  const config = {}

  // deliberately skip optimizations
  const mode = 'development'

  // build webpack config by overriding entry and output
  // and explicitely setting the target
  if (serverConfig && serverRenderPath) {
    config.server = merge(serverConfig, {
      mode,
      name: WEBPACK_NAME_SERVER,
      target: 'node',
      entry: {},
      output: {
        path: filesDir(options),
        filename: '[name].js',
        libraryTarget: 'commonjs2'
      },
      plugins: [
        new webpack.DefinePlugin({
          'process.env.target': JSON.stringify('server')
        })
      ]
    })
  }

  if (clientConfig && clientRenderPath) {
    config.client = merge(clientConfig, {
      mode,
      name: WEBPACK_NAME_CLIENT,
      target: 'web',
      entry: {},
      output: {
        path: filesDir(options),
        filename: '[name].js'
      },
      plugins: [
        new webpack.DefinePlugin({
          'process.env.target': JSON.stringify('client')
        })
      ]
    })
  }

  return config
}

const addFileToQueue = (options, filePath, data, queue) => {
  if (queue.promises[filePath]) return queue.promises[filePath]

  const { serverConfig, serverRenderPath, clientConfig, clientRenderPath } = options
  const serverComponentId = getFileId(filePath, 'server-component')
  const serverResultId = getFileId(filePath, 'server-result')
  const clientComponentId = getFileId(filePath, 'client-component')
  const clientResultId = getFileId(filePath, 'client-result')

  if (serverConfig) {
    queue.config.server.entry[serverComponentId] = filePath

    if (data) {
      queue.config.server.entry[serverResultId] = `/${serverResultId}.js`
      queue.config.server.plugins.push(
        new VirtualModulesPlugin({
          [queue.config.server.entry[serverResultId]]: `
            const ServerRender = require('${serverRenderPath}')
            const ServerComponent = require('${filePath}')
            const serverRender = ServerRender.default || ServerRender
            const serverComponent = ServerComponent.default || ServerComponent

            module.exports = serverRender(serverComponent, ${JSON.stringify(data)})
            `
        })
      )
    }
  }

  if (clientConfig) {
    queue.config.client.entry[clientComponentId] = filePath

    if (data) {
      queue.config.client.entry[clientResultId] = `/${clientResultId}.js`
      queue.config.client.plugins.push(
        new VirtualModulesPlugin({
          [queue.config.client.entry[clientResultId]]: `
            import clientRender from '${clientRenderPath}'
            import Component from '${filePath}'

            export default clientRender(Component, ${JSON.stringify(data)})
            `
        })
      )
    }
  }

  // cache the promises so that files do not get added multiple times
  const promise = new Promise((resolve, reject) => {
    queue.handles[filePath] = {
      reject,
      resolve,
      filePath,
      serverComponentId,
      serverResultId,
      clientComponentId,
      clientResultId
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

async function buildQueued (options, filePath, data = {}, clearCache = false) {
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

  const promise = addFileToQueue(options, filePath, data, QUEUES[queueId])

  debounce(queueId, async () => {
    const { config, handles } = QUEUES[queueId]
    delete QUEUES[queueId]

    try {
      const stats = await runWebpack(config)
      const info = stats.toJson()
      const serverInfo = info.children.find(child => child.name === WEBPACK_NAME_SERVER)
      const clientInfo = info.children.find(child => child.name === WEBPACK_NAME_CLIENT)
      const { uiBase } = options

      Object.values(handles).forEach(({ resolve, filePath, serverComponentId, clientComponentId }) => {
        // needed for dependency resolution
        const serverComponentChunk = serverInfo && serverInfo.chunks.find(chunk => chunk.id === serverComponentId)
        const clientComponentChunk = clientInfo && clientInfo.chunks.find(chunk => chunk.id === clientComponentId)
        // needed for property extraction
        const serverComponentPath = serverComponentChunk && join(filesDir(options), `${getFileId(filePath, 'server-component')}.js`)
        // needed for rendering
        const serverResultPath = serverComponentChunk && join(filesDir(options), `${getFileId(filePath, 'server-result')}.js`)
        const clientResultPath = clientComponentChunk && `${uiBase}${TARGET_FOLDER}/${getFileId(filePath, 'client-result')}.js`

        const object = {
          filePath,
          clientComponentChunk,
          clientResultPath,
          serverComponentChunk,
          serverResultPath,
          serverComponentPath
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
  buildQueued,
  getExtractProperties
}
