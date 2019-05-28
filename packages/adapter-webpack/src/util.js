const { join, relative, sep: MEMORY_PATH } = require('path')
const hash = require('object-hash')
const webpack = require('webpack')
const MemoryFS = require('memory-fs')
const requireFromString = require('require-from-string')
const { DebounceUtil: { debounce } } = require('@uiengine/util')

const QUEUES = {}
const MEMORY_FS = new MemoryFS()

const fileId = (filePath, type) =>
  relative(process.cwd(), filePath).replace(/[^\w\s]/gi, '_') + `-${type}`

const readFromMemory = (filePath, type) => {
  const memPath = join(MEMORY_PATH, `${fileId(filePath, type)}.js`)
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
  if (clientConfig) {
    config.client = Object.assign({}, clientConfig, {
      target: 'web',
      entry: {},
      output: {
        path: MEMORY_PATH,
        filename: '[name].js'
      }
    })
  }

  if (serverConfig) {
    config.server = Object.assign({}, serverConfig, {
      target: 'node',
      entry: {},
      output: {
        path: MEMORY_PATH,
        filename: '[name].js',
        libraryTarget: 'commonjs2'
      }
    })
  }

  return config
}

const addFileToQueue = (options, filePath, queue) => {
  const { serverConfig, serverRenderPath, clientConfig, clientRenderPath } = options

  if (clientConfig) {
    queue.config.client.entry[fileId(filePath, 'clientComponent')] = filePath
    queue.config.client.entry[fileId(filePath, 'clientRender')] = clientRenderPath
  }

  if (serverConfig) {
    queue.config.server.entry[fileId(filePath, 'serverComponent')] = filePath
    queue.config.server.entry[fileId(filePath, 'serverRender')] = serverRenderPath
  }

  return new Promise((resolve, reject) => { queue.handles.push({ resolve, reject }) })
}

const runAsync = compiler =>
  new Promise((resolve, reject) => {
    compiler.run((err, stats) => (err ? reject(err) : resolve(stats)))
  })

const runWebpack = async config => {
  const compiler = webpack(Object.values(config))
  compiler.outputFileSystem = MEMORY_FS

  let stats
  try {
    stats = await runAsync(compiler)
  } catch (err) {
    console.error(err.stack || err)
    if (err.details) {
      console.error(err.details.join('\n'))
      throw new Error(err)
    }
    return
  }

  const info = stats.toJson()

  if (stats.hasWarnings()) {
    console.warn(info.warnings.join('\n'))
  }

  if (stats.hasErrors()) {
    console.error(info.errors.join('\n'))
    throw new Error(info.errors)
  }
}

async function buildQueued (options, filePath) {
  const queueId = `wepack-${hash(options)}`

  if (!QUEUES[queueId]) {
    QUEUES[queueId] = {
      config: buildConfig(options),
      handles: []
    }
  }

  const promise = addFileToQueue(options, filePath, QUEUES[queueId])

  debounce(queueId, async () => {
    const { config, handles } = QUEUES[queueId]
    delete QUEUES[queueId]

    try {
      await runWebpack(config)
      handles.forEach(({ resolve }) => resolve())
    } catch (error) {
      handles.forEach(({ reject }) => reject(error))
    }
  })

  return promise
}

module.exports = {
  readFromMemory,
  requireFromMemory,
  buildQueued
}
