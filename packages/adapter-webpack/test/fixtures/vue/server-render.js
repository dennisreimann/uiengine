const Vue = require('vue')
const { createRenderer } = require('vue-server-renderer')

const renderer = createRenderer({
  template: (result, context) => {
    const state = context.renderState()
    const styles = context.renderStyles()
    const scripts = context.renderScripts()

    return styles + result + state + scripts
  }
})

module.exports = function serverRender (Component, props) {
  return renderer.renderToString(
    new Vue({
      render (h) {
        return h(Component, { props })
      }
    }), { state: props }
  )
}
