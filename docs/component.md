# Component

A component is a single interface unit.
In the UIengine terminology it encapsulates everything belonging to the component:

- Markup
- Styles
- Scripts
- Tests

<div class='ytEmbed'><iframe src="https://www.youtube-nocookie.com/embed/videoseries?list=PLBXz0hPvV2jNAFb9KxvV-2Op8cy3tA8E2&index=2" frameborder="0" allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen></iframe></div>

## Directory Structure

Here is an example structure for some components that use Pug as templating engine (see [adapters](/adapters/)), as well as plain CSS and JavaScript:

```tree
components
|___button
|   |___variants
|   |   |___button-default.html
|   |   |___button-primary.html
|   |___button.css
|   |___button.html
|   |___component.config.js
|   |___README.md
|___slider
    |___tests
    |   |___slider_test.js
    |___variants
    |   |___slider-default.html
    |___component.config.js
    |___slider.css
    |___slider.js
    |___slider.html
    |___README.md
```

A component directory most likely also has a directory named [variants](/basics/variant/), which contains some usage samples.

To add meta data to the component, there is the `component.config.js` file.
This meta data can supply the title, and description as well as a label for the component.

## Component files

The `component.config.js` contents for the button might look like this:

```js
module.exports = {
  title: "Button",
  label: "B1",
  tags: ["atom", "form"],
  variants: ["button-default.html", "button-primary.html"]
}
```

The `title` and `label` get displayed in the documentation.
The `label` is an individual marker that can be used as a reference in mockups or wireframes to reference components.
The `tags` list is optional and can be used to search for pages.
The `variants` attribute is documented in the [variant documentation](/basics/variant/).
The `properties` attribute is documented in the [properties documentation](/advanced/properties/).

In addition to that, there is also the `README.md`, which can contain detailed documentation.
