module.exports = {
  tokens: [
    {
      name: 'General',
      type: 'category',
      layout: 'grid',
      tokens: [
        {
          type: 'icon',
          name: 'Search',
          value: '<i class="search icon"></i>',
          variable: 'search'
        },
        {
          type: 'icon',
          name: 'menu',
          value: '<svg xmlns="http://www.w3.org/2000/svg" width="22" height="16" viewBox="0 0 22 16"><path fill="#000" fill-rule="nonzero" d="M20 12.8a1.3 1.3 0 01.1 2.4H2a1.3 1.3 0 01-.1-2.4H20zm0-6a1.3 1.3 0 01.1 2.4H2a1.2 1.2 0 01-.1-2.4H20zm0-6a1.3 1.3 0 01.1 2.4H2A1.2 1.2 0 011.9.9H20z"/></svg>',
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
