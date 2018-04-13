export const template = (name, pagesDir) =>
  `
module.exports = {
  // Project config: Defaults to name and version from package.json.
  // Here you can overwrite it and add more custom properties.
  // For a detailed documentation of all the options in here see
  // https://github.com/dennisreimann/uiengine/blob/master/docs/config.md
  name: '${name}',

  // Base directories for the input, your raw source files:
  // - components is the root of the directory containing the components
  // - templates contains the variant preview and application templates
  // - pages is the directory of the UIengine's site structure and page markdown files
  // - data contains sample data that can be referenced in variants and pages
  // - entities contains the optional entity definitions for the components
  source: {
    components: './src/components',
    templates: './src/templates',
    pages: './${pagesDir}',
    data: './src/uiengine/data',
    entities: './src/uiengine/entities'
  },

  // Destination paths for the generated output.
  target: './dist',

  // Adapters are used for templating/rendering. Each adapter is a module that gets required
  // and needs to provide functions for setup and rendering. For details see the adapters docs.
  adapters: {
    html: '@uiengine/adapter-html'
  },

  // Here you can configure the template that the variant preview gets embeded in.
  template: 'uiengine.html',

  ui: {
    lang: 'en',
    // hljs: 'atom-one-dark',
    // customStylesFile: '/path-to-overrides.css',
    // breakpoints: {
    //   XS: 320,
    //   S: 560,
    //   M: 760,
    //   L: 960,
    //   XL: 1280
    // }
  }
}
`
