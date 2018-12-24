const hljs = require('highlight.js/lib/highlight')

const LANGUAGES = ['bash', 'css', 'javascript', 'handlebars', 'json', 'markdown', 'nginx', 'xml']

LANGUAGES.forEach(name => {
  const lang = require(`highlight.js/lib/languages/${name}`)
  hljs.registerLanguage(name, lang)
})

module.exports = (code, lang) => {
  const languages = (lang != null) ? [lang] : undefined
  const { value, language } = hljs.highlightAuto(code, languages)
  const highlighted = `<pre class="hljs lang-${lang || language}"><code>${value}</code></pre>`

  return highlighted
}

module.exports.LANGUAGES = LANGUAGES
