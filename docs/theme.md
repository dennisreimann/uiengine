# Theme

UIengine ships with a default theme to get you started quickly.
If you want to use your own theme instead of the default one, there are two options:

- provide the path to a directory inside this project that contains the theme
  (case: you use the theme just for this project)
- give the name of the npm package that is the theme
  (case: you use the theme more than once and want to share it across projects)

UIengine will `require` the theme.
The module has to export an async `render` function as well as a `staticPath`:

- `render(templateId, data)` gets the template name and the data for the page that should get rendered.
  This function is called asynchronously and has to return a `Promise`!
  For details about the incoming `data` structure see the [page data](#page-data) section.
- `staticPath` is the path to the directory containing static files/assets of the theme (scripts, styles, etc.).
  They get copied to the `target` path when the project gets generated.

In addition to that there are **optional hooks for `setup` and `teardown`**.
You can use the setup hook to create a template cache with precompiled templates that `render` can use.
This makes sense when you are working with i.e. Handlebars and you have to register partials and helpers.

Apart from that you most likely will not need to provided these hooks.
But if you do, make sure to return a `Promise`:

- `setup()` hook for initializing the theme.
  Gets called before the project gets generated.
- `teardown()` hook to undo everything that happened during setup.
  This is not used by UIengine itself but you might need this in tests for the theme.

This actually sounds more complicated than it really is.
To see how it actually works have a look at the [default theme](https://github.com/dennisreimann/uiengine-theme-default).

## Page Data

TODO: Show and explain the data structure of a page.

A page gets rendered with a predefined structure of data for that particular page.
This data structure is a JSON object containing the following properties:

- `page`
  - `id`
  - `title`
- `pages` is a flat key-value map containing the data for all pages.
  Each page is accessible with its id as key.
- `navigation` is a flat key-value map containing the navigation information for all pages.
  Each page is accessible with its id as key.
- `config` key-value map containing the data provided in the [project configuration file](./config.md).
