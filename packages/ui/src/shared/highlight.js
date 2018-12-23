const highlightjs = require('highlight.js')

module.exports = (code, lang) => {
  const languages = (lang != null) ? [lang] : undefined
  const { value, language } = highlightjs.highlightAuto(code, languages)
  const highlighted = `<pre class="hljs" lang="${lang || language}"><code>${value}</code></pre>`

  return highlighted
}
