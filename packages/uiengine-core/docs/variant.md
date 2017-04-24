# Variant

A variant is an usage example of a component.
In the UIengine terminology it offers a preview of the component and the data it can be rendered with.

## Directory Structure

Variants are stored per component in the components `variants` folder.
A variant is a file that gets rendered by the assigned [adapter](./adapters.md).   

Here is an example for the variants of a `button` component:

```
components
|___button
    |___variants
        |___button.pug
        |___button-primary.md
        |___button-primary.pug
```

To add some meta data to the variant, just put a markdown file named like the variant alongside the variant file.
This meta data can supply the title, description, and render context as well as a status and label for the variant.

The `button-primary.md` contents might look like this:

```markdown
---
title: Primary button
status: Ready
label: B02
context:
  title: Buy now!
  type: submit
---
Should only appear once on a page. Use this button style for Call To Action buttons and other prominent actions.
````

The `context` is the data the variant file gets rendered with.
The `title`, `status`, and `label` get displayed in the documentation. 
The `status` is meant to communicate the current state of a variant (i.e. "concept", "work in progress", or "ready to use").
The `label` is an individual marker that can be used as a reference in mockups or wireframes to reference variants. 

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
