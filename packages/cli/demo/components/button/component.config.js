module.exports = {
  label: 'A3',
  variants: [
    {
      file: 'primary.html',
      description: 'For call to action type situations. Use only once per page.',
      context: {
        button: {
          text: 'Call to Action',
          type: 'primary'
        }
      }
    },
    {
      file: 'secondary.html',
      description: 'The default button.',
      context: {
        button: {
          text: 'Click me!',
          type: 'secondary'
        }
      }
    }
  ]
}
