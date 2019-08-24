const { join, relative } = require('path')
const webpack = require('webpack')
const merge = require('webpack-merge')
const VirtualModulesPlugin = require('webpack-virtual-modules')
const { yellow, cyan, white, green, red, blue } = require('chalk')
const {
  DebounceUtil: { debounce },
  FileUtil: { requireUncached },
  StringUtil: { crossPlatformPath }
} = require('@uiengine/util')
const { cacheGet, cachePut, cacheDel } = require('./cache')

// queue ids separate different adapter types, as in one project multiple
// file types (i.e. react and vue) can be build with the webpack adapter.
// -> one queue per file type
const getQueueId = require('object-hash')

const QUEUES = {}
const TARGET_FOLDER = '_webpack'
const WEBPACK_NAME_SERVER = 'server'
const WEBPACK_NAME_CLIENT = 'client'

const getFileId = (filePath, type) =>
  join('_build', relative(process.cwd(), filePath).replace(/[^\w\s]/gi, '_'), type)

// prevent problems with cache-loader not being able to lookup virtual
// files by using a custom file type that no other loader uses.
const getEntryPath = id => `/${id}.js-virtual`

const filesDir = ({ target }) => join(target, TARGET_FOLDER)

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

const addFileToBuildQueue = (options, filePath, queue) => {
  if (queue.promises[filePath]) return queue.promises[filePath]

  const { serverConfig, clientConfig } = options
  let serverId, clientId

  if (serverConfig) {
    serverId = getFileId(filePath, 'server')
    queue.config.server.entry[serverId] = filePath
  }

  if (clientConfig) {
    clientId = getFileId(filePath, 'client')
    queue.config.client.entry[clientId] = filePath
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

const addFileToRenderQueue = (options, filePath, queue, data, renderId) => {
  if (queue.promises[renderId]) return queue.promises[renderId]

  const { serverConfig, serverRenderPath, clientConfig, clientRenderPath } = options
  let serverId, clientId

  if (serverConfig) {
    serverId = `${renderId}/server`
    queue.config.server.entry[serverId] = getEntryPath(serverId)
    queue.config.server.plugins.push(
      new VirtualModulesPlugin({
        [queue.config.server.entry[serverId]]: `
          const ServerRender = require('${crossPlatformPath(serverRenderPath)}')
          const ServerComponent = require('${crossPlatformPath(filePath)}')
          const serverRender = ServerRender.default || ServerRender
          const serverComponent = ServerComponent.default || ServerComponent

          module.exports = serverRender(serverComponent, ${JSON.stringify(data)})`
      })
    )
  }

  if (clientConfig) {
    clientId = `${renderId}/client`
    queue.config.client.entry[clientId] = getEntryPath(clientId)
    queue.config.client.plugins.push(
      new VirtualModulesPlugin({
        [queue.config.client.entry[clientId]]: `
          import clientRender from '${crossPlatformPath(clientRenderPath)}'
          import Component from '${crossPlatformPath(filePath)}'

          export default clientRender(Component, ${JSON.stringify(data)})`
      })
    )
  }

  // cache the promises so that files do not get added multiple times
  const promise = new Promise((resolve, reject) => {
    queue.handles[renderId] = {
      reject,
      resolve,
      filePath,
      renderId,
      serverId,
      clientId
    }
  })

  queue.promises[renderId] = promise

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

  if (warnings.length) console.warn(warnings.join('\n\n'))
  if (errors.length) throw new Error(errors.join('\n\n'))

  return stats
}

const getExtractProperties = options => {
  const { properties } = options
  if (['prop-types', 'vue'].includes(properties)) {
    const extractProperties = require(`./props/${properties}`)
    return async (opts, file) => {
      const { serverPath } = await buildQueued(opts, file)
      const ServerComponent = requireUncached(serverPath)
      return ServerComponent ? extractProperties(file, ServerComponent) : {}
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
    debug(options, `buildQueued(${queueId}) ${white('->')} ${blue('build cache clear')}`, filePath)
  } else {
    const cached = cacheGet(queueId, filePath)
    if (cached) {
      debug(options, `buildQueued(${queueId}) ${white('->')} ${green('build cache hit')}`, filePath)
      return cached
    } else {
      debug(options, `buildQueued(${queueId}) ${white('->')} ${red('build cache miss')}`, filePath)
    }
  }

  if (!QUEUES[queueId]) {
    QUEUES[queueId] = {
      id: queueId,
      config: buildConfig(options),
      handles: {},
      promises: {}
    }
  }

  const promise = addFileToBuildQueue(options, filePath, QUEUES[queueId])

  debounce(queueId, async () => {
    const { config, handles } = QUEUES[queueId]
    delete QUEUES[queueId]

    const items = Object.values(handles)

    debug(options, `buildQueued(${queueId}) ${white(`-> queue start (${items.length} files)`)}`)

    try {
      const stats = await runWebpack(config)
      const info = stats.toJson()
      const serverInfo = info.children.find(child => child.name === WEBPACK_NAME_SERVER)
      const clientInfo = info.children.find(child => child.name === WEBPACK_NAME_CLIENT)

      items.forEach(({
        resolve,
        filePath,
        serverId,
        clientId
      }) => {
        // needed for dependency resolution
        const serverChunk = serverInfo && serverInfo.chunks.find(chunk => chunk.id === serverId)
        const clientChunk = clientInfo && clientInfo.chunks.find(chunk => chunk.id === clientId)
        const chunk = serverChunk || clientChunk

        // needed for property extraction
        const serverPath = serverChunk && join(filesDir(options), `${serverId}.js`)

        const object = { serverPath, chunk }

        cachePut(queueId, filePath, object)

        resolve(object)
      })
    } catch (error) {
      items.forEach(({ reject }) => reject(error))
    } finally {
      debug(options, `buildQueued(${queueId}) ${white(`-> queue end (${items.length} files)`)}`)
    }
  })

  return promise
}

async function renderQueued (options, filePath, data = {}, renderId) {
  const queueId = getQueueId(options)

  debug(options, `renderQueued(${queueId}) ${white('->')} ${blue('render cache none')}`, renderId) // intentionally no cache

  if (!QUEUES[queueId]) {
    QUEUES[queueId] = {
      id: queueId,
      config: buildConfig(options),
      handles: {},
      promises: {}
    }
  }

  const promise = addFileToRenderQueue(options, filePath, QUEUES[queueId], data, renderId)

  debounce(queueId, async () => {
    const { config, handles } = QUEUES[queueId]
    delete QUEUES[queueId]

    const items = Object.values(handles)

    debug(options, `renderQueued(${queueId}) ${white(`-> queue start (${items.length} files)`)}`)

    try {
      await runWebpack(config)

      items.forEach(({
        resolve,
        serverId,
        clientId
      }) => {
        resolve({
          clientPath: clientId && `${options.uiBase}${TARGET_FOLDER}/${clientId}.js`,
          serverPath: serverId && join(filesDir(options), `${serverId}.js`)
        })
      })
    } catch (error) {
      items.forEach(({ reject }) => reject(error))
    } finally {
      debug(options, `renderQueued(${queueId}) ${white((`-> queue end (${items.length} files)`))}`)
    }
  })

  return promise
}

const debug = (opts, label, ...additional) => {
  if (!opts.debug) return

  // we intentionally skip the timing functions here
  const prefix = `WebpackAdapter[${opts.ext}]`
  const [, timingLabel, timingEvent] = label.match(/(.*):(start|end)$/) || []
  if (timingLabel && timingEvent) {
    const action = timingEvent === 'start' ? 'time' : 'timeEnd'
    if (timingEvent === 'start') console.debug(yellow(`${prefix}.${timingLabel} -> start`), additional.join(['\n\n']))
    console[action](yellow(`${prefix}.${timingLabel} -> end`))
  } else {
    console.debug(cyan(`${prefix}.${label}`), additional.join(['\n\n']))
  }
}

module.exports = {
  buildQueued,
  renderQueued,
  getExtractProperties,
  debug
}
