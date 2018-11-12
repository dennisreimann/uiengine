module.exports = {
  tokens: [
    {
      name: 'General',
      type: 'category',
      tokens: [
        {
          type: 'icon',
          name: 'Search',
          value: '<i class="search icon"></i>',
          variable: 'search'
        }
      ]
    },
    {
      name: 'Form',
      type: 'category',
      tokens: [
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
          value: '<i class="red remove icon icon"></i>',
          description: 'Error hints and messages',
          variable: 'red remove'
        }
      ]
    }
  ],
  tags: ['Token']
}
