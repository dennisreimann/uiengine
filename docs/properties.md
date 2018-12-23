# Properties

You can document the component properties in the [component config file](/basics/component/#component-file).

List the components using the name as key and the definition for each property as value:

```js
module.exports = {
  properties: {
    '+episode(episode)': {
      episode: {
        type: 'Episode',
        required: true
      }
    },
    '+cta(title, url)': {
      title: {
        type: 'String',
        description: 'Button-Title',
        required: true
      },
      url: {
        type: 'String',
        description: 'URL the button leads to',
        required: true
      }
    }
  }
}
```

The name (i.e. `+episode(episode)`) is an arbitrary value and will be displayed as the title.
You can use it to describe the code that should be used to render the component – like the example above for a Pug component.
