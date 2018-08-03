export const template = (values) =>
  `
module.exports = {
  // Project config: Defaults to name and version from package.json.
  // Here you can overwrite it and add more custom properties.
  // For a detailed documentation of all the options in here see
  // https://uiengine.uix.space/basics/config/
  name: '${values.name}',

  // Base directories for the input, your raw source files:
  // - components is the root of the directory containing the components
  // - templates contains the variant preview and application templates
  // - pages is the directory of the UIengine's site structure and page markdown files
  // - data contains sample data that can be referenced in variants and pages
  // - entities contains the optional entity definitions for the components
  source: {
    components: '${values.source.components}',
    templates: '${values.source.templates}',
    pages: '${values.source.pages}',
    data: '${values.source.data}',
    entities: '${values.source.entities}'
  },

  // Destination paths for the generated output.
  target: '${values.target}',

  // Adapters are used for templating/rendering. Each adapter is a module that gets required
  // and needs to provide functions for setup and rendering. For details see the adapters docs.
  adapters: {
    html: '@uiengine/adapter-html'
  },

  // Here you can configure the template that the variant preview gets embeded in.
  template: '${values.template}',

  ui: {
    lang: '${values.ui.lang}',
    // hljs: '${values.ui.lang}',
    // customStylesFile: '${values.ui.customStylesFile}',
    viewports: {
      Phone: {
        width: 320
      },
      Tablet: {
        width: 768
      },
      Desktop: {
        width: 1280
      }
    },
    breakpoints: {
      XS: 320,
      S: 560,
      M: 768,
      L: 960,
      XL: 1280
    }
  }
}
`
