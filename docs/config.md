# Configuration

The project configuration lives in a file named `uiengine.config.js`.

## Sections

### Project config

Defaults to `name` and `version` from your package.json file.
Here you can overwrite it and add more custom properties.

```js
{
  name: 'ACME Design System',
  version: '1.0.0'
}
```

### Source

The base directories for the input, your raw source files:

- `components` is the root of the directory (or directories) containing the components
- `templates` contains the variant preview and application templates
- `pages` is the directory of the UIengine's site structure and page markdown files

```js
{
  source: {
    components: './src/components',
    templates: './src/templates',
    pages: './uiengine'
  }
}
```

The `source.components` config can also be an array of paths:

```js
{
  source: {
    components: [
      './src/elements',
      './src/modules',
    ]
    // ...
  }
}
```

### Target

Destination paths for the generated output.

```js
{
  target: './dist'
}
```

### Adapters

Adapters are used for templating/rendering.
You configure the adapters using the file extension of the template file as the adapter key.
Each adapter is a module that gets required, for details see the [adapters documentation](/adapters/).

There are two slightly different ways to configure the value:
The first way is to directly reference the module or path that will get required:

```js
{
  adapters: {
    pug: '@uiengine/adapter-pug',
    hbs: '@uiengine/adapter-handlebars',
    jsx: '@uiengine/adapter-react'
  }
}
```

In case you need to provide additional options that will be passed to the adapter, you need to
explicitely reference the module and its options:

```js
{
  adapters: {
    pug: {
      module: '@uiengine/adapter-pug',
      options: {
        pretty: true,
        basedir: './src/components'
      }
    },
    hbs: {
      module: '@uiengine/adapter-handlebars',
      options: {
        namespace: 'my-project'
      }
    }
  }
}
```

In either way the adapter module can be …

- the path to a directory inside this project that contains the adapter
  (case: you use the adapter just for this project)
- the name of the npm package that is the adapter
  (case: you use an existing adapter or want to share yours across projects)

### Template

This is the template the previews gets rendered into.
It should contain references to your styles and scripts, so that the rendered markup has the asset context it needs.

```js
{
  template: 'uiengine.html'
}
```

It must also include the `<!-- uiengine:content -->` comment, which will be replaced with the rendered markup.

Other comments that also get replaced:

- `<!-- uiengine:title -->` is the page title: `<title><!-- uiengine:title --></title>`
- `<!-- uiengine:class -->` is the page class: `<html class="<!-- uiengine:class -->">`
- `<!-- uiengine:theme -->` is the theme id: `<html data-theme="<!-- uiengine:theme -->">`

### Themes

The themes defined here will be shown in the topbar.
The first theme is selected by default.

Each variant and page will be rendered per theme.

```js
{
  themes: [
    {
      id: 'default',
      title: 'Default'
    },
    {
      id: 'funky',
      title: 'Bright colors'
    }
  ]
}
```

If no themes are defined, one with the id `_default` will be used.

### UI

See the [UI docs](/advanced/ui/) for details.

### BrowserSync

The `uiengine build` command (see the [getting started guide](/basics/getting-started/) supports modes for serving and watching files.
Here you can pass in the corresponding [BrowserSync configuration](https://www.browsersync.io/docs/options/):

```js
{
  // either directly
  browserSync: {
    open: false
  },

  // or by referencing an external file:
  browserSync: require('./bs-config.js')
}
```
