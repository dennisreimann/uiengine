# Changelog

## [0.21.0]

### Added

- Rebuild variants and tokens on preview template change

## [0.20.0] - 2018-05-24

### Added

- Fonts are now part of the html-sketchapp export
- Copy page files in subfolders
- Demo content (pages and components) can be generated on initialization
  - Use the `uiengine init --demo` command
  - This should give a basic overview for some of the features
  - Beware: It uses the html adapter, hence the components are very simplistic!

### Changed

- Design token rendering:
  - The tokens are now rendered as part of the preview template
  - Added the token types `font` and `icon`
  - For details see the [design token docs](./docs/ui.md)
- Reduced file watching delay for faster refreshes

## [0.19.0] - 2018-04-14

### Added

- Optional theme switch for your projects themes
  - For details see the [UI docs](./docs/ui.md)
- The adapter `render` function can now return structured data
  - For details see the [adapter docs](./docs/adapters.md)
- The output can be served from a subdirectory
  - For details see the new `base` [theme option](./docs/ui.md)

### Changed

- Rename the `@uiengine/theme` package to `@uiengine/ui`
- Changed the main config object `theme` to `ui`:
  - The former `theme.options` moved into the `ui` config object.
  - Moved the `breakpoints` into the new `ui` config object.
  - Removed the `module` option.
  - For details see the [UI docs](./docs/ui.md)

## [0.18.0] - 2018-04-02

### Changed

- Use scoped packages on npm:
  - `uiengine` -> `@uiengine/core`
  - `uiengine-theme` -> `@uiengine/theme` (note: renamed to `@uiengine/ui` with v0.19.0)
  - `uiengine-adapter-XYZ` -> `@uiengine/adapter-XYZ`

## [0.17.0] - 2018-04-02

### Added

- Integration for [html-sketchapp]
  - Generates Sketch libraries via html-sketchapp-cli compatible export
  - For details see the [integration docs](./docs/integrations.md#html-sketchapp)

### Changed

- Replace the `variantTemplate` config entry key name with `template`
- Rename the `uiengine-theme-default` package to ``uiengine-theme`

## [0.16.0] - 2018-03-11

### Added

- Search for pages and components title, tags and content excerpt
- Tags for pages, components and variants
  - Can be used to cross-reference and search items
- Ability for toggling the navigation on desktop breakpoints
- Links in footer to navigate to the previous and next page
- Settings for locale and highlight.js theme
- Integration for Google Analytics
  - Provide your `analyticsId` (`UA-XXX-X`) in the [project config](./docs/config.md)

## [0.15.0] - 2018-03-01

### Changed

- Variant data moved into component config
  - For details see the [variant docs](./docs/variant.md)

## [0.14.0] - 2018-02-10

### Changed

- More flexible configuration lookup
  - The config file is now retrieved via [cosmiconfig](https://github.com/davidtheclark/cosmiconfig)
  - The default config file is `uiengine.config.js`
  - For alternative ways to store your config (i.e. in package.json) see the cosmiconfig docs

## [0.13.0] - 2018-02-09

### Changed

- Simplified templates config and template references
  - The `templates` entry in the config file got removed
  - The `variantTemplate` entry got added to the config file
  - Templates need to be referred to in page config by full name (including the file extension)
  - Templates are still resolved relative to `source.templates`

- Wording changed from "schema" to "entities" and "properties"
  - This reflects the actual use case and intention of the feature better

- The UI is now extendible via CSS custom properties
  - The `skin` option for the UI has been removed
  - You can now style the UI using the [`customStylesFile` option](./docs/ui.md)

- - - - -

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).
