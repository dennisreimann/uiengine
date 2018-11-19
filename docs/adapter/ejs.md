# EJS

🚦 *State:* Production ready

[![npm](https://img.shields.io/npm/v/@uiengine/adapter-ejs.svg)](https://www.npmjs.com/package/@uiengine/adapter-ejs)

## Configuration

Plain and simple:

```js
{
  adapters: {
    ejs: '@uiengine/adapter-ejs'
  }
}
```

With options:

```js
{
  adapters: {
    ejs: {
      module: '@uiengine/adapter-ejs',
      options: {
        debug: true
      }
    }
  }
}
```

The options are passed to the [EJS renderer](https://www.npmjs.com/package/ejs#options).

In addition to that there is the option `debug` for a more detailed output in case of rendering errors.
