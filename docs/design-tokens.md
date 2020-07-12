# Design Tokens

The UIengine interface includes templates for displaying various types of design tokens.

<div class='ytEmbed'><iframe title="UIengine Introduction 02: Config, Pages and Design Tokens" src="https://www.youtube-nocookie.com/embed/videoseries?list=PLBXz0hPvV2jNAFb9KxvV-2Op8cy3tA8E2&index=1" frameborder="0" allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen></iframe></div>

## Tokens definition

The design tokens are listed under the `tokens` key of a `page.config.js` file:

```js
module.exports = {
  tokens: [
    {
      type: 'size',
      name: 'S',
      value: '.5rem'
    },
    {
      type: 'size',
      name: 'M',
      value: '1rem'
    },
    {
      type: 'size',
      name: 'L',
      value: '1.5rem'
    },
    {
      type: 'size',
      name: 'XL',
      value: '3rem'
    }
  ]
}
```

Each token consists of the following attributes:

- `type`: See [types](#types) for details
- `name`
- `value`

These attributes are optional:

- `variable`: Variable name
- `reference`: The name of the referenced token
- `description`
- `themeIds`: Restricts display to only the given list of theme ids. Can be used for categories and tokens.

### Types

#### `category`

The tokens can also be seperated into multiple categories.

The category type supports the following attributes:

- `name`: The category title
- `tokens`: A list of tokens
- `id`: An optional ID for the container

```js
module.exports = {
  title: 'Colors',
  tokens: [
    {
      type: 'category',
      name: 'Brand',
      tokens: [
        {
          type: 'color',
          name: 'brandPrimary',
          value: 'yellow'
        },
        {
          type: 'color',
          name: 'brandSecondary',
          value: 'blue'
        }
      ]
    },
    {
      type: 'category',
      name: 'Neutral',
      tokens: [
        {
          type: 'color',
          name: 'neutralWhite',
          value: '#FFF'
        },
        {
          type: 'color',
          name: 'neutralBlack',
          value: '#000'
        }
      ]
    }
  ]
}
```

#### `color`

The color type supports the following attributes:

- `name`: The color name
- `value`: The CSS value of the color
- `variable`
- `reference`
- `description`

```js
module.exports = {
  title: 'Colors',
  tokens: [
    {
      type: 'color',
      name: 'Brand Primary',
      value: 'yellow',
      variable: '--brand-primary'
    },
    {
      type: 'color',
      name: 'Brand Secondary',
      value: 'blue',
      variable: '--brand-secondary'
    },
    {
      type: 'color',
      name: 'Background',
      value: 'blue',
      reference: 'Brand Secondary'
    }
  ]
}
```

#### `font`

The font type supports the following attributes:

- `name`: The font name
- `value`: The CSS to render the font
- `text`: Optional text for the sample. Defaults to "The quick brown fox jumps over the lazy dog"
- `sizes`: Optional list of CSS font sizes. Displays the `text` in the default font size if omitted.
- `description`
- `license`
- `fontweight`

```js
module.exports = {
  title: 'Fonts',
  tokens: [
    {
      type: 'category',
      name: 'Arial',
      tokens: [
        {
          type: 'font',
          fontweight: 'light / 100',
          value: 'font-family: Arial; font-weight: 100;'
        },
        {
          type: 'font',
          fontweight: 'regular / 400',
          value: 'font-family: Arial; font-weight: 400;'
        },
        {
          type: 'font',
          fontweight: 'bold / 800',
          value: 'font-family: Arial; font-weight: 800;'
        }
      ]
    },
    {
      type: 'category',
      name: 'Lato',
      tokens: [
        {
          type: 'font',
          fontweight: 'regular',
          value: 'font-family: Lato;',
          variable: 'Lato',
          description: 'Use wisely.',
          text: 'Just some custom sample text to show the usage of this font.',
          license: 'Google Fonts',
          sizes: ['24px', '18px', '14px']
        }
      ]
    }
  ]
}
```

#### `icon`

The icon type supports the following attributes:

- `name`: The icon name
- `value`: The HTML to render the icon
- `usage`: Alternative usage info, replaces `value`
- `description`
- `variable`
- `reference`

```js
module.exports = {
  title: 'Icons',
  layout: 'grid',  // 'grid' is default, the other option is 'table'
  tokens: [
    {
      type: 'icon',
      name: 'Search',
      value: '<i class="search icon"></i>',
      variable: 'search'
    },
    {
      type: 'icon',
      name: 'Check',
      value: '<i class="green check icon"></i>',
      description: 'Display successful user input',
      variable: 'green check'
    },
    {
      type: 'icon',
      name: 'Error',
      value: '<i class="red error icon"></i>',
      description: 'Error hints and messages',
      variable: 'red error'
    }
  ]
}
```

#### `border-width`

The border-width type supports the following attributes:

- `name`: The border-width token name
- `value`: The CSS value to render the border width
- `variable`
- `description`
- `reference`

```js
module.exports = {
  title: 'Border Widths',
  tokens: [
    {
      name: 'Border Width Thin',
      value: '1px',
      variable: '$border-width-thin'
    },
    {
      name: 'Border Width Thick',
      value: '4px',
      variable: '$border-width-thick'
    }
  ]
}
```

#### `border-style`

The border-style type supports the following attributes:

- `name`: The border-style token name
- `value`: The CSS value to render the border style
- `variable`
- `description`
- `reference`

```js
module.exports = {
  title: 'Border Styles',
  tokens: [
    {
      name: 'Border Style Solid',
      value: 'solid',
      variable: '$border-style-solid'
    },
    {
      name: 'Border Style Dashed',
      value: 'dashed',
      variable: '$border-style-dashed'
    }
  ]
}
```

#### `border-radius`

The border-radius type supports the following attributes:

- `name`: The border-radius token name
- `value`: The CSS value to render the border radius
- `variable`
- `description`
- `reference`

```js
module.exports = {
  title: 'Border Radius',
  tokens: [
    {
      name: 'Border Radius Default',
      value: '6px',
      variable: '$border-radius-default'
    },
    {
      name: 'Border Radius Pill',
      value: '20rem',
      variable: '$border-radius-pill'
    }
  ]
}
```

#### `box-shadow`

The box-shadow type supports the following attributes:

- `name`: The box-shadow token name
- `value`: The CSS value to render the box shadow
- `variable`
- `description`
- `reference`

```js
module.exports = {
  title: 'Box Shadows',
  tokens: [
    {
      name: 'Box Shadow Default',
      value: '0 2px 6px 0 rgba(0, 41, 77, 0.1)',
      variable: '$box-shadow-default'
    },
    {
      name: 'Box Shadow Modal',
      value: '0 2px 20px 0 rgba(0, 0, 0, 0.2)',
      variable: '$box-shadow-modal'
    }
  ]
}
```

#### `opacity`

The opacity type supports the following attributes:

- `name`: The opacity token name
- `value`: The CSS value to render the opacity
- `variable`
- `description`
- `reference`

```js
module.exports = {
  title: 'Opacity',
  tokens: [
    {
      name: 'Opacity 30%',
      value: '0.3',
      variable: '$opacity-30'
    },
    {
      name: 'Opacity 75%',
      value: '0.75',
      variable: '$opacity-75'
    }
  ]
}
```
