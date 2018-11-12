module.exports = {
  tokens: [
    {
      name: 'Lato',
      type: 'category',
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
    },
    {
      name: 'Fallback',
      type: 'category',
      tokens: [
        {
          type: 'font',
          fontweight: 'light / 200',
          value:
            "font-family: 'Helvetica Neue', Arial, Helvetica, sans-serif; font-weight: 200;"
        },
        {
          type: 'font',
          fontweight: 'regular / 400',
          value:
            "font-family: 'Helvetica Neue', Arial, Helvetica, sans-serif; font-weight: 400;"
        },
        {
          type: 'font',
          fontweight: 'bold / 800',
          value:
            "font-family: 'Helvetica Neue', Arial, Helvetica, sans-serif; font-weight: 800;"
        }
      ]
    }
  ],
  tags: ['Token']
}
