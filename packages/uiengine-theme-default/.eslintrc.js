// https://eslint.org/docs/user-guide/configuring

module.exports = {
  root: true,
  parserOptions: {
    parser: 'babel-eslint',
    sourceType: 'module'
  },
  env: {
    browser: true
  },
  extends: [
    'standard', // https://github.com/standard/standard/blob/master/docs/RULES-en.md
    'plugin:vue/essential'
  ],
  // custom rules
  'rules': {
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0,
    // allow icons for the svg sprite to be imported but not used
    'no-unused-vars': ["error", { "varsIgnorePattern": "Icon" }]
  }
}
