const R = require('ramda')
const { basename, extname, join } = require('path')
const {
  DebugUtil: { debug3 },
  FileUtil: { copy },
  StringUtil: { crossPlatformPath }
} = require('@uiengine/util')

let _plugins

const initializePlugins = () => {
  return {
    ui: {
      js: [],
      css: [],
      tabs: [],
      actions: [],
      iframe_js: []
    }
  }
}

class API {
  constructor (id, config) {
    this.id = id
    this.config = config
  }

  async addAssetFile (filePath, options = {}) {
    const ext = extname(filePath).replace(/^\./, '')
    const type = ext === 'js' && options.iframe ? 'iframe_js' : ext
    const current = _plugins.ui[type]
    const { target, ui: { base } } = this.config

    const publicPath = join('_assets', 'plugins', this.id, basename(filePath))
    const targetPath = join(target, publicPath)
    const assetPath = crossPlatformPath(join(base || '', publicPath))

    await copy(filePath, targetPath)

    if (current) _plugins = R.assocPath(['ui', type], R.append(assetPath, current), _plugins)
  }

  addPreviewAction (opts) {
    const { actions } = _plugins.ui
    const action = {
      id: this.id,
      ...opts
    }

    _plugins = R.assocPath(['ui', 'actions'], R.append(action, actions), _plugins)
  }

  addPreviewTab (opts) {
    const { tabs } = _plugins.ui
    const tab = {
      id: this.id,
      ...opts
    }

    _plugins = R.assocPath(['ui', 'tabs'], R.append(tab, tabs), _plugins)
  }
}

async function setup (state) {
  debug3(state, 'Plugin.setup():start')

  _plugins = initializePlugins()

  const { config: { plugins } } = state

  for (const plugin of (plugins || [])) {
    const { setup } = require(plugin.module)

    if (typeof setup === 'function') {
      const id = basename(plugin.module)
      const api = new API(id, state.config)

      await setup(plugin.options, api)
    }
  }

  debug3(state, 'Plugin.setup():end')

  return _plugins
}

module.exports = {
  setup
}
