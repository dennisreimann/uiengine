module.exports = {
  fixturesFolder: 'fixtures',
  screenshotsFolder: 'screenshots',
  videosFolder: 'videos',
  chromeWebSecurity: false,
  viewportWidth: 1200,
  viewportHeight: 1200,
  e2e: {
    // We've imported your old cypress plugins here.
    // You may want to clean this up later by importing these.
    setupNodeEvents(on, config) {
      return require('./plugins/index.js')(on, config)
    },
    baseUrl: 'http://localhost:3000/test-project/',
    specPattern: 'integration/**/*.cy.{js,jsx,ts,tsx}',
    supportFile: 'support/index.js',
  },
}
