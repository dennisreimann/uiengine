const breakpoints = require('./src/lib/breakpoints.json')

module.exports = {
  url: 'http://localhost:3000/_sketch.html',
  outDir: '../tmp',
  viewports: {
    Mobile: '320x568'
  }
  // puppeteerArgs: '--no-sandbox --disable-setuid-sandbox',
  // puppeteerExecutablePath: 'google-chrome-unstable'
}
