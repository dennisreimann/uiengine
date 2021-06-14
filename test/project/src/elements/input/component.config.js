module.exports = {
  title: 'Inputs',
  tags: ['Atom', 'Form'],

  // This context is applied to all variants
  context: {
    id: 'name',
    name: 'person[name]'
  },

  // Sample for variants referenced via filename
  variants: [
    'text.hbs',
    'text.pug',
    'text.njk',
    'text-required.pug',
    'text-disabled.pug',
    'number.pug'
  ]
}
