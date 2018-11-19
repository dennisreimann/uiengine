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
