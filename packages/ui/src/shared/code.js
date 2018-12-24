const highlight = require('./highlight')

const REGEX_CLEAN = new RegExp('([\\s]*?<!--\\s?omit:.*?\\s?-->)', 'gi')

const omit = (mark, string) => {
  const regexpOmit = new RegExp(`([\\s]*?<!--\\s?omit:${mark}:start\\s?-->[\\s\\S]*?<!--\\s?omit:${mark}:end\\s?-->)`, 'gi')
  return string.replace(regexpOmit, '').replace(REGEX_CLEAN, '')
}

const decorateCode = (code, lang) => {
  return highlight(code, lang)
}

const decorateContext = json => {
  return highlight(JSON.stringify(json, null, 2), 'json')
}

module.exports = {
  decorateCode,
  decorateContext,
  omit
}
