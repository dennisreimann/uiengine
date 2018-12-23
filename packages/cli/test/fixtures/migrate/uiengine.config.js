module.exports = {
  name: 'Migrate UIengine Project',

  source: {
    components: ['./components'],
    templates: './templates',
    pages: './pages',
    // deprecated sources, keep them in here for the migrations
    entities: './entities',
    data: './data'
  },

  target: './dist'
}
