const { join, relative, sep: MEMORY_PATH } = require('path')
const webpack = require('webpack')
const MemoryFS = require('memory-fs')
const requireFromString = require('require-from-string')

const MEMORY_FS = new MemoryFS()

const runAsync = compiler =>
  new Promise((resolve, reject) => {
    compiler.run((err, stats) => (err ? reject(err) : resolve(stats)))
  })

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

const runWebpack = async config => {
  const compiler = webpack(Object.values(config))
  compiler.outputFileSystem = MEMORY_FS

  let stats = null
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

const buildConfig = (options, filePath) => {
  const { serverConfig, serverRenderPath, clientConfig, clientRenderPath } = options
  const config = {}

  // build webpack config by overriding entry and output
  // and explicitely setting the target
  if (clientConfig) {
    config.client = Object.assign({}, clientConfig, {
      target: 'web',
      entry: {
        [fileId(filePath, 'clientComponent')]: filePath,
        [fileId(filePath, 'clientRender')]: clientRenderPath
      },
      output: {
        path: MEMORY_PATH,
        filename: '[name].js'
      }
    })
  }

  if (serverConfig) {
    config.server = Object.assign({}, serverConfig, {
      target: 'node',
      entry: {
        [fileId(filePath, 'serverComponent')]: filePath,
        [fileId(filePath, 'serverRender')]: serverRenderPath
      },
      output: {
        path: MEMORY_PATH,
        filename: '[name].js',
        libraryTarget: 'commonjs2'
      }
    })
  }

  return config
}

module.exports = {
  readFromMemory,
  requireFromMemory,
  runWebpack,
  buildConfig
}
