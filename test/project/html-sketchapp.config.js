// https://github.com/seek-oss/html-sketchapp-cli#viewport-sizes-and-responsive-design
const breakpoints = require('./src/lib/breakpoints.json')
const viewports = Object.keys(breakpoints).reduce((result, name) => {
  const width = breakpoints[name]
  result[name] = `${width}x2048`
  return result
}, {})

module.exports = {
  url: 'http://localhost:3000/_sketch.html',
  outDir: '../tmp/_sketch',
  viewports
}
