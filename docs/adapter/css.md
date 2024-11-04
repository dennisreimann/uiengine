# CSS

🚦 *State:* Production ready

[![npm](https://img.shields.io/npm/v/@uiengine/adapter-css.svg)](https://www.npmjs.com/package/@uiengine/adapter-css)

This adapter parses css files for custom properties.
You can use it to display theme settings for your components.
The adapter extracts css variables and constructs a data structure that gets displayed in the UI.

## Configuration

Plain and simple:

```js
{
  adapters: {
    css: '@uiengine/adapter-css'
  }
}
```

With options:

```js
{
  adapters: {
    css: {
      module: '@uiengine/adapter-css',
      options: {
        componentThemesDir: 'themes', // 'themes' is the default
        globalThemesDir: './src/styles/themes'
      }
    }
  }
}
```

The `componentThemesDir` option is the directory name of the component custom properties (defaults to "themes").
The `globalThemesDir` option is the path to the directory containing the app-wide custom properties (optional).

## Example

File structure:

```tree
src
|___styles
|   |___themes              <- globalThemesDir
|   |   |___funky.css
|   |   |___plain.css
|   |___app.css
|___components
    |___button
        |___themes          <- componentThemesDir
        |   |___funky.css
        |   |___plain.css
        |___button.css
```

See the [test project](https://github.com/dennisreimann/uiengine/tree/master/test/project/src) for an example of the file contents.

For an example of the output have a look at the "Themes" tab of the [label component sample](https://dennisreimann.github.io/uiengine/test-project/patterns/atoms/label/).
