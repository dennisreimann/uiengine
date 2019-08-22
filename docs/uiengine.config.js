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
    pages: 'site',
    additionalWatches: ['./*.md', './adapter/*.md']
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
      {
        tag: 'link',
        attrs: {
          rel: 'stylesheet',
          href: 'https://cdn.jsdelivr.net/npm/docsearch.js@2/dist/cdn/docsearch.min.css'
        }
      },
      {
        tag: 'link',
        attrs: {
          rel: 'prefetch',
          href: 'https://cdn.jsdelivr.net/npm/docsearch.js@2/dist/cdn/docsearch.min.js'
        }
      },
      preconnect('https://cdn.jsdelivr.net'),
      preconnect('https://s.ytimg.com'),
      preconnect('https://i.ytimg.com'),
      preconnect('https://www.google.com'),
      preconnect('https://fonts.gstatic.com'),
      preconnect('https://www.youtube-nocookie.com'),
      preconnect('https://yt3.ggpht.com')
    ],
    foot: `
      <script src="https://cdn.jsdelivr.net/npm/docsearch.js@2/dist/cdn/docsearch.min.js"></script>
      <script>
        docsearch({
          apiKey: '9feb71b81a25c046ff57fe54b86f879b',
          indexName: 'uiengine',
          inputSelector: '.topbar input[name="query"]'
        });
      </script>`
  },

  browserSync: {
    open: false
  }
}
