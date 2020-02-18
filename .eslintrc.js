// https://eslint.org/docs/user-guide/configuring

module.exports = {
  root: true,
  parserOptions: {
    parser: 'babel-eslint'
  },
  env: {
    browser: true,
    node: true,
    es6: true,
    mocha: true
  },
  extends: [
    'standard' // https://github.com/standard/standard/blob/master/docs/RULES-en.md
  ],
  plugins: [
    'import',
    'node',
    'promise'
  ],
  // custom rules
  rules: {
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0
  }
}
