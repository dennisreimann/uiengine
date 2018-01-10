// https://eslint.org/docs/user-guide/configuring

module.exports = {
  root: true,
  parser: 'babel-eslint',
  parserOptions: {
    sourceType: 'module',
    ecmaVersion: 2017
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
  // custom rules
  'rules': {
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0
  }
}
