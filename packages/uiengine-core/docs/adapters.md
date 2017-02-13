# Adapters

UIengine supports adapters for rendering.
This is to support multiple templating engines and offer a template agnostic way for rendering.

Adapters are registered for a particular file extension.
UIengine will `require` an adapter when it needs to process a file with the given extension.

You configure the adapters for your project in the [project configuration file](./config.md),
using the file extension as the adapter key.

There are two slightly different ways to configure the value:
The first way is to directly reference the module or path that will get required:

```yaml
adapters:
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
```

In either way the module can be …

- the path to a directory inside this project that contains the adapter
  (case: you use the adapter just for this project)
- the name of the npm package that is the adapter
  (case: you use an existing adapter or want to share yours across projects)

# Adapter Modules

An adapter module has to export an async `render` function:

- `render(opts, filePath, data)` gets the adapter options, the path to the file that should get
  rendered and the data to render it with.
  This function is called asynchronously and has to return a `Promise`!
  The incoming `data` depends on the file that gets rendered:
  For variations this is the context that is provided via the [variation data](./variation.md).

In addition to that there is an **optional hooks for `registerComponentFile`**.
You can use this hook to i.e. register partials when working with Handlebars:

- `registerComponentFile()` gets called before the project gets generated.
  When generating incremental changes during development you can use this to update the
  registered cpomponent files as this hook gets called with changed files too.

In case you provided this hook, make sure to return a `Promise`!
For an example see the [Handlebars adapter](https://github.com/dennisreimann/uiengine-adapter-handlebars/blob/master/src/index.js).
