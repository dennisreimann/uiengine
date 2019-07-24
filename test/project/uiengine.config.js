const breakpoints = require('./lib/breakpoints.json')
const viewports = require('./lib/viewports.json')
const pugAdapterOptions = require('./lib/pug-adapter-options')
const cssAdapterOptions = require('./lib/css-adapter-options')
const webpackAdapterReactOptions = require('./lib/webpack-adapter-react-options')
const webpackAdapterVueOptions = require('./lib/webpack-adapter-vue-options')

// option to simulate base - mainly for debugging and development purposes
const simulateBase = false
const base = simulateBase ? '/design-system/' : '/'
const target = simulateBase ? `../tmp${base}` : '../tmp'
const baseDir = simulateBase ? '../tmp' : undefined

module.exports = {
  // Project config: Defaults to name and version from package.json.
  // Here you can overwrite it and add more custom properties.
  name: 'UIengine Sample Project',
  version: '1.0.0',
  copyright: '<a href="https://github.com/dennisreimann/uiengine">Generated with UIengine</a>',
  debug: 1,

  // Base directories for the input, your raw source files:
  // - components is the root of the directory containing the components
  // - templates contains the variant preview and application templates
  // - pages is the directory of the UIengine's site structure and page markdown files
  source: {
    components: ['./src/elements', './src/modules'],
    templates: './src/templates',
    pages: './uiengine/pages',
    additionalWatches: './lib'
  },

  // Destination path for the generated site.
  target,

  // Adapters are used for templating/rendering. Each adapter is a module that gets required
  // and needs to provide functions for setup and rendering. For details see the adapters docs.
  adapters: {
    pug: {
      module: '@uiengine/adapter-pug',
      options: pugAdapterOptions
    },
    vue: {
      module: '@uiengine/adapter-webpack',
      options: webpackAdapterVueOptions
    },
    css: {
      module: '@uiengine/adapter-css',
      options: cssAdapterOptions
    },
    jsx: {
      module: '@uiengine/adapter-webpack',
      options: webpackAdapterReactOptions
    },
    hbs: '@uiengine/adapter-handlebars',
    marko: '@uiengine/adapter-marko',
    html: '@uiengine/adapter-html',
    ejs: '@uiengine/adapter-ejs'
  },

  // Here you can configure the template that the variant preview gets embeded in.
  template: 'uiengine.pug',

  themes: [
    {
      id: 'plain',
      title: 'Plain'
    },
    {
      id: 'funky',
      title: 'Funky crazy awesome'
    }
  ],

  ui: {
    base,
    breakpoints,
    viewports,
    defaultPreviewMode: 'viewports',
    customStylesFile: '/assets/styles/uiengine-custom-styles.css',
    repoBaseUrl: 'https://github.com/dennisreimann/uiengine/blob/master/test/project/'
  },

  browserSync: {
    open: false,
    server: {
      baseDir
    }
  }
}
