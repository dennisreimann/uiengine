const { join, relative } = require('path')
const webpack = require('webpack')
const webpackMerge = require('webpack-merge')
const VirtualModulesPlugin = require('webpack-virtual-modules')
const getBuildId = require('object-hash')
const cache = require('./cache')
const { yellow, cyan, white, green, blue } = require('chalk')
const {
  DebounceUtil: { debounce },
  StringUtil: { crossPlatformPath }
} = require('@uiengine/util')

const QUEUES = {}
const TARGET_FOLDER = '_webpack'
const WEBPACK_NAME_SERVER = 'server'
const WEBPACK_NAME_CLIENT = 'client'

// queue ids separate different adapter types, as in one project multiple
// file types (i.e. react and vue) can be build with the webpack adapter.
// -> one queue per file type
const getQueue = options => {
  const id = getBuildId(options)
  if (!QUEUES[id]) {
    QUEUES[id] = {
      id,
      config: buildConfig(options),
      handles: {},
      promises: {}
    }
  }

  return QUEUES[id]
}

const drainQueue = id => {
  const queue = QUEUES[id]
  delete QUEUES[id]

  return queue
}

// naive implementation of a  dynamic threshold, which ensures
// high value for initial build and keeps rebuild times low.
const getDebounceThreshold = buildId =>
  cache.all(buildId).length === 0 ? 500 : 50

const getFileId = (filePath, type) =>
  join('_build', relative(process.cwd(), filePath).replace(/[^\w\s]/gi, '_'), type)

// prevent problems with cache-loader not being able to lookup virtual
// files by using a custom file type that no other loader uses.
const getEntryPath = id => `/${id}.js-virtual`

const filesDir = ({ target }) => join(target, TARGET_FOLDER)

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

const merge = webpackMerge.strategy({ entry: 'replace', output: 'replace' })

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

// https://www.npmjs.com/package/parallel-webpack#nodejs-api
const runWebpack = config =>
  new Promise((resolve, reject) => {
    webpack(Object.values(config), (error, stats) => {
      if (error) {
        reject(error)
      } else {
        const { warnings, errors } = stats.toJson('errors-warnings')

        // warnings an errors eventually occur twice, once per client and server
        if (warnings.length) console.warn(warnings.join('\n\n'))
        if (errors.length) return reject(new Error(errors.join('\n\n')))

        return resolve(stats)
      }
    })
  })

async function buildQueued (options, filePath) {
  const queue = getQueue(options)

  const cachedPromise = queue.promises[filePath]
  if (cachedPromise) {
    debug(options, `buildQueued(${queue.id}, ${white(filePath)}) ${white('->')} ${green('cache hit')}`)
    return cachedPromise
  } else {
    debug(options, `buildQueued(${queue.id}, ${white(filePath)}) ${white('->')} ${blue('cache clear')}`)
  }

  // add file to build config
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

  // cache the promises so that files do not get added multiple times.
  // promises are given out to build requests, the handles are used
  // when the build is done to answer the promises/build requests.
  queue.promises[filePath] = new Promise((resolve, reject) => {
    queue.handles[filePath] = { reject, resolve, filePath, serverId, clientId }
  })

  debounce(queue.id, () => runBuildQueue(options, queue.id), getDebounceThreshold(queue.id))

  return queue.promises[filePath]
}

async function runBuildQueue (options, buildId) {
  const { config, handles } = drainQueue(buildId)
  const items = Object.values(handles)

  debug(options, `runBuildQueue(${buildId}) ${white(`-> queue start (${items.length} files)`)}`)

  try {
    const stats = await runWebpack(config)
    const info = stats.toJson()
    const serverInfo = info.children.find(child => child.name === WEBPACK_NAME_SERVER)
    const clientInfo = info.children.find(child => child.name === WEBPACK_NAME_CLIENT)

    items.forEach(({ resolve, filePath, serverId, clientId }) => {
      // needed for dependency resolution
      const serverChunk = serverInfo && serverInfo.chunks.find(chunk => chunk.id === serverId)
      const clientChunk = clientInfo && clientInfo.chunks.find(chunk => chunk.id === clientId)
      const chunk = serverChunk || clientChunk

      // needed for property extraction
      const serverPath = serverChunk && join(filesDir(options), `${serverId}.js`)

      const object = { filePath, clientId, serverId, serverPath, chunk }
      cache.put(buildId, filePath, object)
      resolve(object)
    })
  } catch (error) {
    items.forEach(({ reject }) => reject(error))
  } finally {
    debug(options, `runBuildQueue(${buildId}) ${white(`-> queue end (${items.length} files)`)}`)
  }
}

async function renderQueued (options, filePath, data = {}, renderId) {
  const queue = getQueue(options)

  const cachedPromise = queue.promises[renderId]
  if (cachedPromise) {
    debug(options, `renderQueued(${queue.id}, ${white(filePath)}) ${white('->')} ${green('cache hit')}`)
    return cachedPromise
  } else {
    debug(options, `renderQueued(${queue.id}, ${white(filePath)}) ${white('->')} ${blue('cache clear')}`)
  }

  // add file to render config
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

  // cache the promises so that files do not get added multiple times.
  // promises are given out to render requests, the handles are used
  // when the build is done to answer the promises/build requests.
  queue.promises[renderId] = new Promise((resolve, reject) => {
    queue.handles[renderId] = { reject, resolve, serverId, clientId }
  })

  debounce(queue.id, () => runRenderQueue(options, queue.id), getDebounceThreshold(queue.id))

  return queue.promises[renderId]
}

async function runRenderQueue (options, queueId) {
  const { config, handles } = drainQueue(queueId)
  const items = Object.values(handles)

  debug(options, `runRenderQueue(${queueId}) ${white(`-> queue start (${items.length} files)`)}`)

  try {
    await runWebpack(config)

    items.forEach(({ resolve, serverId, clientId }) => {
      resolve({
        clientPath: clientId && `${options.uiBase}${TARGET_FOLDER}/${clientId}.js`,
        serverPath: serverId && join(filesDir(options), `${serverId}.js`)
      })
    })
  } catch (error) {
    items.forEach(({ reject }) => reject(error))
  } finally {
    debug(options, `runRenderQueue(${queueId}) ${white(`-> queue end (${items.length} files)`)}`)
  }
}

module.exports = {
  buildQueued,
  renderQueued,
  getBuildId,
  debug
}
