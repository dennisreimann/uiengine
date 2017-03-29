# Configuration

The project configuration lives in a file named `uiengine.yml`.
This file is written in YAML and you can use the custom UIengine extensions that are described in the [YAML documentation](./yaml.md).

## Sections

### Project config

Defaults to `name` and `version` from your package.json file.
Here you can overwrite it and add more custom properties.

```yaml
name: My projects interface exchange
version: 1.0.0
```

### Source

The base directories for the input, your raw source files:
- `components` is the root of the directory containing the components
- `templates` contains the variation preview and sandbox templates
- `pages` is the directory of the UIengine's site structure and page markdown files
- `data` contains sample data that can be referenced in variations and pages

```yaml
source:
  components: ./src/components
  templates: ./src/templates
  pages: ./src/pages
  data: ./src/data
```

### Target

Destination paths for the generated output.

```yaml
target: ./dist
```

### Adapters

Adapters are used for templating/rendering.
You configure the adapters using the file extension of the template file as the adapter key.
Each adapter is a module that gets required, for details see the [adapters documentation](./adapters.md).

There are two slightly different ways to configure the value:
The first way is to directly reference the module or path that will get required:

```yaml
adapters:
  pug: uiengine-adapter-pug
  hbs: uiengine-adapter-handlebars
  jsx: uiengine-adapter-react
```

In case you need to provide additional options that will be passed to the adapter, you need to
explicitely reference the module and its options:

```yaml
adapters:
  pug:
    module: uiengine-adapter-pug
    options:
      pretty: true
      basedir: ./src/components
  hbs: 
    module: uiengine-adapter-handlebars
    options:
      namespace: 'my-project'
```

In either way the adapter module can be …

- the path to a directory inside this project that contains the adapter
  (case: you use the adapter just for this project)
- the name of the npm package that is the adapter
  (case: you use an existing adapter or want to share yours across projects)

### Templates

By default the list of templates is generated from the files within the templates source directory – the filename without extension being the key.
You will need at least a template named `variation` for the variation preview.
Here you can configure this preview as well as other templates.

```yaml
templates:
  variation: variation-preview.pug
```

### Theme 

Like an adapter, UIengine will require the theme, which has to provide a defined set of functions for setup and rendering.
For details see the [theme documentation](./theme.md).

```yaml
theme:
  module: uiengine-theme-default
  options:
    lang: en
    skin: default
    hljs: atom-one-dark
```

### Breakpoints 

The breakpoints defined here will be shown in the viewport resizer tool for the variation preview.
Declare them with the name as key and the minimum media query pixel being the value.

```yaml
breakpoints:
  XS: 320
  S: 560
  M: 760
  L: 960
  XL: 1280
```

### BrowserSync

The `uiengine generate` command (see the [getting started guide](./getting-started.md) supports modes for serving and watching files.
Here you can pass in the corresponding [BrowserSync configuration](https://www.browsersync.io/docs/options/), either directly or by referencing an external file.

```yaml
browserSync: !include bs-config.js
```
