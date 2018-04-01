const breakpoints = require('./src/lib/breakpoints.json')
const pugAdapterOptions = require('./src/lib/pug-adapter-options')
const vueAdapterOptions = require('./src/lib/vue-adapter-options')

module.exports = {
  // Project config: Defaults to name and version from package.json.
  // Here you can overwrite it and add more custom properties.
  name: 'UIengine Sample Project',
  version: '1.0.0',
  copyright: '<a href="https://github.com/dennisreimann/uiengine">Generated with UIengine</a>',

  // Base directories for the input, your raw source files:
  // - components is the root of the directory containing the components
  // - templates contains the variant preview and application templates
  // - pages is the directory of the UIengine's site structure and page markdown files
  source: {
    components: './src/components',
    templates: './src/templates',
    entities: './src/uiengine/entities',
    pages: './src/uiengine/pages',
    data: './src/uiengine/data'
  },

  // Destination path for the generated site.
  target: '../tmp',

  // Adapters are used for templating/rendering. Each adapter is a module that gets required
  // and needs to provide functions for setup and rendering. For details see the adapters docs.
  adapters: {
    pug: {
      module: 'uiengine-adapter-pug',
      options: pugAdapterOptions
    },
    vue: {
      module: 'uiengine-adapter-vue',
      options: vueAdapterOptions
    },
    vhtml: {
      module: 'uiengine-adapter-vue',
      options: vueAdapterOptions
    },
    js: 'uiengine-adapter-vue',
    jsx: 'uiengine-adapter-react',
    hbs: 'uiengine-adapter-handlebars',
    marko: 'uiengine-adapter-marko',
    html: 'uiengine-adapter-html',
    ejs: 'uiengine-adapter-ejs'
  },

  // Here you can configure the template that the variant preview gets embeded in.
  template: 'uiengine.pug',

  // UIengine will `require` the theme, which has to provide a defined set of functions
  // for setup and rendering. For details see the theme docs.
  theme: {
    module: 'uiengine-theme',
    options: {
      customStylesFile: '/assets/styles/uiengine-custom-styles.css'
    }
  },

  breakpoints,

  browserSync: {
    open: false
  }
}
