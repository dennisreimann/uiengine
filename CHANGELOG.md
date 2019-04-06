# Changelog

## [2.1.0] - ongoing development

### Added

- Provide custom meta tags via the [`ui` config](/advanced/ui/).
- Option to restricts variant display to a given theme id.
  - See the `theme` option of the [variant configuration](/basics/variant/).

### Fixes

- HTML escaping in titles

## [2.0.0] - 2019-01-28

### Added

- Improved Windows compatibility, feedback welcome!
- The pen icon in the interface opens files in VS Code when working locally
- Pages can be set to be initially collapsed – [see the docs](/basics/page/)
- `@uiengine/core` exports the `markdown` function to transform markdown to html

### Changed

- Themes are now a first-class citizen and widely supported
  - The `themes` config option moved to the [root level config](/basics/config/) (previously `ui.themes`)
  - Each variant and page gets rendered per theme
  - The adapters [`render` function](/adapters/#render(opts%2C-filepath%2C-data)) gets the `themeId` as an option
- Moved `analyticsId` config option into [`ui` config](/advanced/ui/).
- The `filesFor…` adapter function now also receive the [`options` as first argument](/adapters/#scaffolding)
- Extracted Theo integration into its own [`@uiengine/bridge-theo` package](/advanced/integrations/#theo)
- YAML and Frontmatter in Markdown files has been removed.
  - File changes:
    - component.md -> component.config.js and README.md
    - page.md -> page.config.js and README.md
    - data.yml -> data.js (deprecated, see below)
    - Entity.yml -> Entity.js
  - Use the `npx uiengine migrate` command to automatically migrate

### Removed

- Removed `source.data` config option
  - Require files directly in your `component.config.js` or `page.config.js`.
- Removed `source.entities` config option
  - Require files directly in your `component.config.js`.
  - One less custom concept to worry about :)
- Removed `ui.customActions`
  - Will be replaced with a third-party plugin API

---

## [1.4.0] - 2018-11-01

### Added

- CSS Adapter: Parses css files for custom properties and display theme settings for components.
  - For details see the [CSS adapter docs](/adapters/css/).
- React Adapter: Partial support for PropType definitions in external files

## [1.3.0] - 2018-10-14

### Added

- The UI displays theme properties (css custom properties)
- Override locales or single keys in a locale
  - For details see the [UI docs](/advanced/ui/#locales).

### Changed

- Improved the styles and structure for content pages and elements
  - Tl;DR More whitespace and bigger fonts
  - The `intro` and `details` containers got added

## [1.2.0] - 2018-09-30

### Added

- Dependency graph for components
  - Adapters can extract the dependencies and dependents in `registerComponentFile`
  - Component dependencies and dependents get displayed in the UI
  - Component changes rebuild the dependent variants and templates automatically
  - The React and Pug adapters support this already
- Option `ui.repoBaseUrl` for linking components and pages to the repo
  - For details see the [UI docs](/advanced/ui/).

### Changed

- Removed parent package `uiengine`
  - use scoped packages directly, i.e. `@uiengine/core` plus `@uiengine/adapter-html`

## [1.1.0] - 2018-09-02

### Added

- Allow `source.components` config to define lists of directories
- Config overrides for CLI (see CLI help/usage for details)
- Option `skipScaffold` for adapters
  - Prevents creation of files for components and variants
  - Replaces the cli `--exclude` flag for the `uiengine component` command
  - See the [adapters documentation](/adapters/) for details.

### Changed

- Removed filesFor hooks from html adapter
  - The html adapter is part of the standard install, but it is unlikely that you would want to generate the files for every new component.
- Variant ID and filename contain the index
  - allows for rendering multiple variants based on the same file
- CLI commands (init, component, page) do not overwrite existing files
  - unless the `--force` flag is provided

### Fixed

- Windows compatibility
- Proper handling of scroll position on navigation

## [1.0.0] - 2018-07-17

First public stable release. 🎉

For details see the
[UIengien 1.0 blog post](https://dennisreimann.de/articles/uiengine-1-0.html).

## [0.23.0] - 2018-07-15

### Added

- Set browser-sync `startPath` for custom UI base
- New [documentation site](https://uiengine.uix.space/), generated with the UIengine itself

### Changed

- Improved the CLI flags and usage docs
- Improved [React adapter hooks](/adapters/react/)
- Improved React adapter Properties extraction

### Fixed

- Skip generating HTML Sketchapp export if template is missing

## [0.22.0] - 2018-06-19

### Added

- Adapters `registerComponentFile` functions can extract and return information from component files
  - Use this to generate documentation from your #React PropType definitions etc.
  - See the [adapters documentation](/adapters/) for details.
- Option to wrap the content of a [custom page template](/basics/page/#templates) in the preview template
  - In case you want to provide only the content of the `<body>`.
  - Works like with variants, whose content replaces the `uiengine:content` comment.
- Internal links in documentation are now handled via the UI router.

### Fixed

- Use theme hash across all previews and links
- Display of indented code blocks

## [0.21.0] - 2018-06-11

### Added

- Viewports are a new preview mode in addition to breakpoints
  - See the [`ui.viewports`](/advanced/ui/#viewports) documentation for details
- Rebuild variants and tokens on preview template change
- The comment `<!-- uiengine:class -->` now also gets replaced in the preview template
  - This should be added to the `html` tag and can be used for customizing special previews.

### Changed

- CSS custom properties used by UIengine are now prefixed with `--uie-`
  - In case you are using the [`ui.customStylesFile`](/advanced/ui/#customStylesFile) you need to update the UIengine custom properties.

### Fixed

- Hide inactive scrollbars on Windows

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
  - For details see the [design token docs](/advanced/ui/)
- Reduced file watching delay for faster refreshes

## [0.19.0] - 2018-04-14

### Added

- Optional theme switch for your projects themes
  - For details see the [UI docs](/advanced/ui/)
- The adapter `render` function can now return structured data
  - For details see the [adapter docs](/adapters/)
- The output can be served from a subdirectory
  - For details see the new `base` [theme option](/advanced/ui/)

### Changed

- Rename the `@uiengine/theme` package to `@uiengine/ui`
- Changed the main config object `theme` to `ui`:
  - The former `theme.options` moved into the `ui` config object.
  - Moved the `breakpoints` into the new `ui` config object.
  - Removed the `module` option.
  - For details see the [UI docs](/advanced/ui/)

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
  - For details see the [integration docs](/advanced/integrations/#html-sketchapp)

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
  - Provide your `analyticsId` (`UA-XXX-X`) in the [project config](/basics/config/)

## [0.15.0] - 2018-03-01

### Changed

- Variant data moved into component config
  - For details see the [variant docs](/basics/variant/)

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
  - You can now style the UI using the [`customStylesFile` option](/advanced/ui/)

- - - - -

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).
