# Nunjucks

🚦 *State:* Production ready

[![npm](https://img.shields.io/npm/v/@uiengine/adapter-nunjucks.svg)](https://www.npmjs.com/package/@uiengine/adapter-nunjucks)

## Configuration

Plain and simple:

```js
{
  adapters: {
    njk: '@uiengine/adapter-nunjucks'
  }
}
```

With options:

```js
{
  adapters: {
    njk: {
      module: '@uiengine/adapter-nunjucks',
      options: {
        trimBlocks: true,
        lstripBlocks: true,
        noCache: true,
        globals: {
          time: () => {
            return new Date().getTime()
          }
        },
        filters: {
          shorten: (str, count) => {
            return str.slice(0, count || 5)
          }
        }
      }
    }
  }
}
```

The options are passed to the [Nunjucks Environment](https://mozilla.github.io/nunjucks/api.html#environment).

In addition to that there are other options that allows for setting a custom Loader (passing a `loader` object into the options) or a custom Environment (passing an `env` object in the options), as well as adding custom Globals or custom Filters, as per the example above.

If you'd like to be able to use the custom globals or custom filters in the base templates, ensure you pass a `searchPaths` array into the options that includes all the paths where your Nunjucks files can be found, including the template files.
