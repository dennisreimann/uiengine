# Variant

A variant is an usage example of a component.
In the UIengine terminology it offers a preview of the component and the data it can be rendered with.

<div class='ytEmbed'><iframe title="UIengine Introduction 03: Components and Variants" src="https://www.youtube-nocookie.com/embed/videoseries?list=PLBXz0hPvV2jNAFb9KxvV-2Op8cy3tA8E2&index=2" frameborder="0" allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen></iframe></div>

## Directory Structure

Variants are stored per component in the components `variants` folder.
A variant is a file that gets rendered by the assigned [adapter](/adapters/).

Here is an example for the variants of a `button` component:

```tree
components
|___button
    |___variants
        |___button-default.pug
        |___button-primary.pug
```

To add meta data to the variant, just use the `variants` list in the [component file](/basics/component/#component-file).
The meta data can supply the `file`, `title`, `description` and `label` for the variant.
You might also want to provide the `context` (data and variables) for rendering the variant.

The component file for the button (`button/component.config.js`) might look like this:

```js
module.exports = {
  title: "Button",
  label: "B1",

  // General context, shared across all variants
  context: {
    title: "Click me!",
    type: "submit"
  },
  variants: [
    {
      file: "button-default.png",
      title: "Default button",
      label: "B1-1"
      // the default button inherits the general context
    },
    {
      file: "button-primary.png",
      title: "Primary button",
      description: "Use this for calls to action",
      label: "B1-2",
      // the primary button provides its own context,
      // hence it does not inherit the general context
      context: {
        title: "Click me now!",
        type: "submit",
        primary: true
      }
    }
  ]
}
```

Attributes:

- `file` is the only required attribute and references the variants filename.
- `context` is the data the variant file gets rendered with.
  If the veriant does not specify an own context it will be inherited from the general context specified on the component level.
- `title` and `description` get displayed in the documentation.
- `label` is an individual marker that can be used as a reference in mockups or wireframes to reference variants.
- `themeIds`: Restricts display to only the given list of theme ids.

You can also provide a short version of the `variants` list like this:

```js
module.exports = {
  title: "Button",
  label: "B1",

  // General context, shared across all variants
  context: {
    title: "Click me!",
    type: "submit"
  },

  variants: [
    "button-default.png",
    "button-primary.png"
  ]
}
```

This is useful if you want to manipulate the order and are fine with these defaults:

- `file`: The filename from the list
- `title`: The titleized filename without the extension
- `context`: The general context specified on the component level

You also have the option to leave out the `variants` attribute altogether.
In this case all files inside the components variants folder will be used with the mentioned defaults.

## Code and Preview

To omit certain parts in the raw code and rendered preview, you can use the HTML comment markers.

Hide something in the raw code view:

```html
<!-- omit:code:start -->
Everything in between these HTML comments is omitted in the raw code view
<!-- omit:code:end -->
```

Hide something in the rendered preview:

```html
<!-- omit:preview:start -->
Everything in between these HTML comments is omitted in the rendered preview
<!-- omit:preview:end -->
```
