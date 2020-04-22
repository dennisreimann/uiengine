module.exports = {
  tokens: [
    {
      name: 'Brand',
      type: 'category',
      tokens: [
        {
          type: 'color',
          name: 'Brand Primary',
          value: '#FF183E',
          description: 'Primary brand color',
          reference: null,
          variable: '$color-brand-primary'
        },
        {
          type: 'color',
          name: 'Brand Secondary',
          value: '#331833',
          description: 'Secondary brand color',
          reference: null,
          variable: '$color-brand-secondary'
        }
      ]
    },
    {
      name: 'Neutral',
      type: 'category',
      tokens: [
        {
          type: 'color',
          name: 'Neutral 100',
          value: '#FFF',
          reference: null,
          variable: '$color-neutral-100'
        },
        {
          type: 'color',
          name: 'Neutral 90',
          value: '#E5E5E5',
          reference: null,
          variable: '$color-neutral-90'
        },
        {
          type: 'color',
          name: 'Neutral 75',
          value: '#BFBFBF',
          reference: null,
          variable: '$color-neutral-75'
        },
        {
          type: 'color',
          name: 'Neutral 50',
          value: '#7F7F7F',
          reference: null,
          variable: '$color-neutral-50'
        },
        {
          type: 'color',
          name: 'Neutral 25',
          value: '#404040',
          reference: null,
          variable: '$color-neutral-25'
        },
        {
          type: 'color',
          name: 'Neutral 10',
          value: '#1A1A1A',
          reference: null,
          variable: '$color-neutral-10'
        },
        {
          type: 'color',
          name: 'Neutral 0',
          value: '#000',
          reference: null,
          variable: '$color-neutral-0'
        },
        {
          type: 'color',
          name: 'Neutral White',
          value: '#FFF',
          reference: 'Neutral 100',
          variable: '$color-neutral-white'
        },
        {
          type: 'color',
          name: 'Neutral Black',
          value: '#000',
          reference: 'Neutral 0',
          variable: '$color-neutral-black'
        }
      ]
    },
    {
      name: 'Text',
      type: 'category',
      tokens: [
        {
          type: 'color',
          name: 'Text Default',
          value: '#331833',
          reference: 'Brand Secondary',
          variable: '$color-text-default'
        },
        {
          type: 'color',
          name: 'Text On Dark',
          value: '#FFF',
          reference: 'Neutral 100',
          variable: '$color-text-on-dark'
        },
        {
          type: 'color',
          name: 'Text On Black',
          value: '#E5E5E5',
          reference: 'Neutral 90',
          variable: '$color-text-on-black'
        }
      ]
    },
    {
      name: 'Background',
      type: 'category',
      tokens: [
        {
          type: 'color',
          name: 'Background White',
          value: '#FFF',
          reference: 'Neutral 100',
          variable: '$color-background-white'
        },
        {
          type: 'color',
          name: 'Background Dark',
          value: '#FF183E',
          reference: 'Brand Primary',
          variable: '$color-background-dark'
        },
        {
          type: 'color',
          name: 'Background Black',
          value: '#000',
          reference: 'Neutral 0',
          variable: '$color-background-black'
        }
      ]
    }
  ],
  tags: ['Token']
}
