// eslint-disable-next-line no-unused-vars
const React = require('react')
const { renderToString } = require('react-dom/server')

module.exports = (Component, props) =>
  renderToString(<Component {...props} />)
