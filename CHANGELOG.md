# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

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

- The theme is now extendible via CSS custom properties
  - The `skin` option for the theme has been removed
  - You can now style the theme using the [`customStylesFile` option](./docs/theme.md)
