const pkg = require('../packages/core/package.json')

const preconnect = href => ({
  tag: 'link',
  attrs: {
    rel: 'preconnect',
    href
  }
})

module.exports = {
  name: 'UIengine Documentation',
  version: pkg.version,

  source: {
    pages: 'site'
  },

  target: 'dist',

  ui: {
    customStylesFile: '/styles/docs.css',
    meta: [
      {
        tag: 'meta',
        attrs: {
          name: 'description',
          content: 'The UIengine is a workbench for UI-driven development: A tool for developers and designers to build and document web sites and apps.'
        }
      },
      preconnect('https://s.ytimg.com'),
      preconnect('https://i.ytimg.com'),
      preconnect('https://www.google.com'),
      preconnect('https://fonts.gstatic.com'),
      preconnect('https://www.youtube-nocookie.com'),
      preconnect('https://yt3.ggpht.com')
    ]
  },

  browserSync: {
    open: false
  }
}
