module.exports = [
  {
    name: 'Highlight Color',
    type: 'color',
    variable: '--highlight-color',
    default: {
      variable: '--app-call-to-action-color'
    },
    themes: {
      plain: {
        variable: '--app-call-to-action-color',
        value: '#ff0'
      },
      funky: {
        variable: null,
        value: '#f00'
      }
    }
  },
  {
    name: 'Font Size',
    variable: '--font-size',
    default: {
      value: '1rem'
    },
    themes: {
      plain: {
        variable: null,
        value: '1rem'
      },
      funky: {
        variable: null,
        value: '1.2rem'
      }
    }
  },
  {
    name: 'Spacing',
    type: 'size',
    variable: '--spacing',
    default: {
      value: '.8rem'
    },
    themes: {
      plain: {
        variable: '--app-spacing',
        value: '.8rem'
      },
      funky: {
        variable: '--funky-spacing',
        value: '1.6rem'
      }
    }
  }
]
