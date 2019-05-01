// https://github.com/seek-oss/html-sketchapp-cli#viewport-sizes-and-responsive-design
const viewports = require('./lib/viewports.json')

const viewportsSketch = Object.keys(viewports).reduce((result, name) => {
  const { width } = viewports[name]
  result[name] = `${width}x2500`
  return result
}, {})

module.exports = {
  url: 'http://localhost:3000/_sketch/plain.html',
  outDir: '../tmp/_sketch',
  viewports: viewportsSketch
}
