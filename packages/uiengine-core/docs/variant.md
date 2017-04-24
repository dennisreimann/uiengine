# variant

A variant is an usage example of a component.
In the UIengine terminology it offers a preview of the component and the data it can be rendered with.

## Directory Structure

Variants are stored per component in the components `variants` folder.
A variant is a file that gets rendered by the assigned [adapter](./adapters.md).   

TODO: Show and explain the data structure of a variant.

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
