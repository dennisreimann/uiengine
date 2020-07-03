:::intro
Icons are used to provide additional meaning or in places where text label doesn’t fit. They communicate messages at a glance and draw attention to important information.
:::

Each icon ships in SVG format.

### Usage

The recommended way to use the project icons is to reference them from the sprite:

```svg
<svg viewBox="0 0 1 1" class="c-icon [additional-classes]">
  <use xlink:href="[icon-name]"></use>
</svg>
```

### Styling

You can easily style the icons using CSS:

```css
.c-icon {
  width: 2rem;
  height: 2rem;
  color: $brand-primary;
}
```
