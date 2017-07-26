# Component

A component is a single interface unit.
In the UIengine terminology it encapsulates everything belonging to the component:
- Markup
- Styles
- Scripts
- Tests

## Directory Structure

Here is an example structure for some components that use Pug as templating engine (see [adapters](./adapters.md)), as well as plain CSS and JavaScript:

```
components
|___button
|   |___variants
|   |   |___button.pug
|   |   |___button-primary.md
|   |   |___button-primary.pug
|   |___button.css
|   |___button.pug
|   |___component.md
|___slider
    |___tests
    |   |___slider_test.js
    |___variants
    |   |___slider.md
    |   |___slider.pug
    |___component.md
    |___slider.css
    |___slider.js
    |___slider.pug
```

A component directory most likely also has a directory named [variants](./variant.md), which contains some usage samples.  

To add some meta data to the component, there is the `component.md` markdown file.
This meta data can supply the title, and description as well as a label for the component.

## Component file

The `component.md` contents for the button might look like this:

```markdown
---
title: Button
label: B1
---
The different button styles that are used on our website.
````

The `title` and `label` get displayed in the documentation. 
The `label` is an individual marker that can be used as a reference in mockups or wireframes to reference components. 
