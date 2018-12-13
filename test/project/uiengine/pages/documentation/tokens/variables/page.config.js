module.exports = {
  'tokens': [
    {
      'type': 'category',
      'name': 'Colors',
      'tokens': [
        {
          'variable': '--app-accent-color',
          'name': 'App Accent Color',
          'type': 'color',
          'themes': {
            'plain': {
              'value': 'black',
              'variable': '--plain-black-color'
            },
            'funky': {
              'value': 'orange',
              'variable': '--funky-orange-color'
            }
          },
          'description': 'Accent color'
        },
        {
          'variable': '--app-call-to-action-color',
          'name': 'App Call To Action Color',
          'type': 'color',
          'themes': {
            'plain': {
              'value': 'red',
              'variable': '--plain-red-color'
            },
            'funky': {
              'value': 'orange',
              'variable': '--funky-orange-color'
            }
          },
          'description': 'Primary interaction color'
        }
      ]
    },
    {
      'type': 'category',
      'name': 'Shadows',
      'tokens': [
        {
          'variable': '--app-box-shadow',
          'name': 'App Box Shadow',
          'themes': {
            'plain': {
              'value': '0 0 8px 2px rgba(92,43,54,0.2)'
            },
            'funky': {
              'value': '0 0 8px 2px rgba(0,0,0,0.2)'
            }
          }
        }
      ]
    },
    {
      'type': 'category',
      'name': 'Borders',
      'tokens': [
        {
          'variable': '--app-border-radius',
          'name': 'App Border Radius',
          'type': 'size',
          'themes': {
            'plain': {
              'value': '0'
            },
            'funky': {
              'value': '3px'
            }
          }
        },
        {
          'variable': '--app-divider',
          'name': 'App Divider',
          'type': 'size',
          'themes': {
            'plain': {
              'value': '2px'
            },
            'funky': {
              'value': '7px'
            }
          }
        }
      ]
    },
    {
      'type': 'category',
      'name': 'Spaces',
      'tokens': [
        {
          'variable': '--app-space-xs',
          'name': 'App Space XS',
          'type': 'size',
          'themes': {
            'plain': {
              'value': '0.25rem'
            },
            'funky': {
              'value': '0.25rem'
            }
          }
        },
        {
          'variable': '--app-space-s',
          'name': 'App Space S',
          'type': 'size',
          'themes': {
            'plain': {
              'value': '0.5rem'
            },
            'funky': {
              'value': '0.5rem'
            }
          }
        },
        {
          'variable': '--app-space-m',
          'name': 'App Space M',
          'type': 'size',
          'themes': {
            'plain': {
              'value': '1rem'
            },
            'funky': {
              'value': '1rem'
            }
          }
        },
        {
          'variable': '--app-space-l',
          'name': 'App Space L',
          'type': 'size',
          'themes': {
            'plain': {
              'value': '1.5rem'
            },
            'funky': {
              'value': '1.5rem'
            }
          }
        },
        {
          'variable': '--app-space-xl',
          'name': 'App Space XL',
          'type': 'size',
          'themes': {
            'plain': {
              'value': '2rem'
            },
            'funky': {
              'value': '2rem'
            }
          }
        },
        {
          'variable': '--app-space-xxl',
          'name': 'App Space XXL',
          'type': 'size',
          'themes': {
            'plain': {
              'value': '4rem'
            },
            'funky': {
              'value': '4rem'
            }
          }
        }
      ]
    }
  ]
}
