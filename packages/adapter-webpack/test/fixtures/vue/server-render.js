const Vue = require('vue')
const { createRenderer } = require('vue-server-renderer')

const renderer = createRenderer()

module.exports = function serverRender (Component, props) {
  return renderer.renderToString(
    new Vue({
      render (h) {
        return h(Component, { props })
      }
    })
  )
}
