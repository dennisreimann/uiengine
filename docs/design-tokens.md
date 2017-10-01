# Design Tokens

The UIengine theme includes templates for displaying various types of design tokens.
These tokens can be referenced in the [YAML frontmatter](./yaml.md#frontmatter) of a [page file](./page.md#page-file).

## Tokens definition

The design tokens are listed under the `tokens` key of a page:

```markdown
---
title: Spaces
tokens:
- type: size
  name: S
  value: .5rem
- type: size
  name: M
  value: 1rem
- type: size
  name: L
  value: 1.5rem
- type: size
  name: XL
  value: 3rem
---
Our spacings.
```

Each token consists of the following attributes:

- `type`
- `name`
- `value`
- `variable`
- `description`
- `reference`: The name of the referenced token property

### Categories

The tokens can also be seperated into multiple categories.

```markdown
---
title: Colors
tokens:
- type: category
  name: Brand
  tokens:
  - type: color
    name: brandPrimary
    value: yellow
  - type: color
    name: brandSecondary
    value: blue
- type: category
  name: Neutral
  tokens:
  - type: color
    name: neutralWhite
    value: "#FFF"
  - type: color
    name: neutralBlack
    value: "#000"
- type: category
  name: Background
  tokens:
  - type: color
    name: backgroundLight
    value: "#FFF"
    reference: neutralWhite
  - type: color
    name: backgroundDark
    value: blue
    reference: brandSecondary
---
Our colors.
```

## Theo integration

You can integrate and consume design tokens defined with the [Theo](https://github.com/salesforce-ux/theo#spec) tokens spec.
For details on the format see the [integrations docs](./integrations.md#theo).
