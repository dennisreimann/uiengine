# Component

A component is a single interface unit.
In the UIengine terminology it encapsulates everything belonging to the component:

- Markup
- Styles
- Scripts
- Tests

## Directory Structure

Here is an example structure for some components that use Pug as templating engine (see [adapters](./adapters.md)), as well as plain CSS and JavaScript:

```tree
components
|___button
|   |___variants
|   |   |___button-default.html
|   |   |___button-primary.html
|   |___button.css
|   |___button.html
|   |___component.md
|___slider
    |___tests
    |   |___slider_test.js
    |___variants
    |   |___slider-default.html
    |___component.md
    |___slider.css
    |___slider.js
    |___slider.html
```

A component directory most likely also has a directory named [variants](./variant.md), which contains some usage samples.

To add meta data to the component, there is the `component.md` markdown file.
This meta data can supply the title, and description as well as a label for the component.

## Component file

The `component.md` contents for the button might look like this:

```markdown
---
title: Button
label: B1
tags:
- atom
- form
variants:
- button-default.html
- button-primary.html
---
The different button styles that are used on our website.
````

The `title` and `label` get displayed in the documentation.
The `label` is an individual marker that can be used as a reference in mockups or wireframes to reference components.
The `tags` list is optional and can be used to search for pages.
The `variants` attribute is documented in the [variant documentation](./variant.md).
The `properties` attribute is documented in the [properties documentation](entities-properties.md#Component-properties).
