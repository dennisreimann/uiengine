# Design Tokens

The UIengine interface includes templates for displaying various types of design tokens.

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
- `theme`: Restricts display to only the given theme id. Can be used for categories and tokens.

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
- `text`: An optional text for the sample. Defaults to "The quick brown fox jumps over the lazy dog"
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

## Theo integration

You can integrate and consume design tokens defined with the [Theo](https://github.com/salesforce-ux/theo#spec) tokens spec.
For details on the format see the [integrations docs](/advanced/integrations/#theo).
