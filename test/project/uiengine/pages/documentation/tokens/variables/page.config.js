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
          'type': 'shadow',
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
          'type': 'border-radius',
          'themes': {
            'plain': {
              'value': '20rem'
            },
            'funky': {
              'value': '3px'
            }
          }
        },
        {
          'variable': '--app-border-width',
          'name': 'App Border Width',
          'type': 'border-width',
          'themes': {
            'plain': {
              'value': '2px'
            },
            'funky': {
              'value': '7px'
            }
          }
        },
        {
          'variable': '--app-border-style',
          'name': 'App Border Style',
          'type': 'border-style',
          'themes': {
            'plain': {
              'value': 'dashed'
            },
            'funky': {
              'value': 'dotted'
            }
          }
        }
      ]
    },
    {
      'type': 'category',
      'name': 'Opacity',
      'tokens': [
        {
          'variable': '--app-opacity-30',
          'name': 'Opacity 30%',
          'type': 'opacity',
          'themes': {
            'plain': {
              'value': '0.3'
            },
            'funky': {
              'value': '0.3'
            }
          }
        },
        {
          'variable': '--app-opacity-60',
          'name': 'Opacity 60%',
          'type': 'opacity',
          'themes': {
            'plain': {
              'value': '0.6'
            },
            'funky': {
              'value': '0.6'
            }
          }
        },
        {
          'variable': '--app-opacity-90',
          'name': 'Opacity 90%',
          'type': 'opacity',
          'themes': {
            'plain': {
              'value': '0.9'
            },
            'funky': {
              'value': '0.9'
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
