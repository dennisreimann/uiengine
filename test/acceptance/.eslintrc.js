module.exports = {
  root: false,
  plugins: [
    "cypress"
  ],
  extends: [
    "plugin:cypress/recommended"
  ],
  env: {
    "cypress/globals": true
  }
}
