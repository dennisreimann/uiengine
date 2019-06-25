const Vue = require('vue')
const { createRenderer } = require('vue-server-renderer')

const renderer = createRenderer({
  template: (result, context) => {
    const styles = context.styles ? `${context.styles}\n` : ''
    return styles + result
  }
})

module.exports = function serverRender (Component, props) {
  return renderer.renderToString(
    new Vue({
      render (h) {
        return h(Component, { props })
      }
    }), {}
  )
}
