const { renderToString } = require('react-dom/server')

module.exports = function serverRender (Component, props) {
  return renderToString(Component(props))
}
