# Changelog

## [0.13.0]

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
