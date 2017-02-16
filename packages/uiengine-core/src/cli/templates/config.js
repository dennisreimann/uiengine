export const template = (name) =>
`
# Project config: Defaults to name and version from package.json.
# Here you can overwrite it and add more custom properties.
name: ${name}

# Base directories for the input, your raw source files:
# - components is the root of the directory containing the components
# - templates contains the variation preview and sandbox templates
# - pages is the directory of the UIengine's site structure and page markdown files
source:
  components: ./src/components
  templates: ./src/templates
  pages: ./src/pages

# Destination paths for the generated output.
target: ./dist

# Adapters are used for templating/rendering. Each adapter is a module that gets required
# and needs to provide functions for setup and rendering. For details see the adapters docs.
adapters:
  pug:
    module: uiengine-adapter-pug
    options:
      pretty: true
      basedir: ./src/components

# Here you can configure the template that the variation preview gets embeded in.
templates:
  variation: variation-preview.pug

# UIengine will require the theme, which has to provide a defined set of functions
# for setup and rendering. For details see the theme docs.
# theme: ./my-uiengine-theme
`
