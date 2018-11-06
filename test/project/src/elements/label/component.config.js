module.exports = {
  label: 'A1',
  tags: ['Atom', 'Form'],
  properties: {
    Label: {
      id: {
        type: 'String',
        description: 'The label text',
        required: true
      },
      title: {
        type: 'String',
        description: 'The id of the referenced form element',
        required: true
      }
    }
  },
  context: {
    id: 'name',
    title: 'Name'
  },
  variants: [
    {
      file: 'label.ejs',
      title: 'Label (EJS)',
      label: 'A1.0',
      tags: ['EJS']
    },
    {
      file: 'label.hbs',
      title: 'Label (Handlebars)',
      label: 'A1.1',
      tags: ['Handlebars']
    },
    {
      file: 'label.html',
      title: 'Label (HTML)',
      label: 'A1.2',
      tags: ['HTML']
    },
    {
      file: 'label.marko',
      title: 'Label (Marko)',
      label: 'A1.3',
      tags: ['Marko']
    },
    {
      file: 'label.pug',
      title: 'Label (Pug)',
      label: 'A1.4',
      tags: ['Pug']
    },
    {
      file: 'label.jsx',
      title: 'Label (React)',
      label: 'A1.5.1',
      tags: ['React']
    },
    {
      file: 'label.jsx',
      title: 'Label (React)',
      label: 'A1.5.2',
      tags: ['React'],
      context: {
        id: 'surname',
        title: 'Surname'
      }
    },
    {
      file: 'label-vue.js',
      title: 'Label (Vue JS)',
      label: 'A1.6',
      tags: ['Vue']
    },
    {
      file: 'label-vue-sfc.vhtml',
      title: 'Label (Vue SFC)',
      label: 'A1.7',
      tags: ['Vue']
    }
  ]
}
