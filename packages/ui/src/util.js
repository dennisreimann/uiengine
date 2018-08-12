const highlightjs = require('highlight.js')

const highlight = (code, lang) => {
  const languages = (lang != null) ? [lang] : undefined
  const { value, language } = highlightjs.highlightAuto(code, languages)
  const highlighted = `<pre class="hljs" lang="${lang || language}"><code>${value}</code></pre>`

  return highlighted
}

const localize = (dict, key, interpolations) => {
  const localized = key.split('.').reduce((a, b) => a && a[b], dict)

  if (localized && interpolations) {
    return localized.replace(/%\{(.+?)\}/g, (match, name) => {
      const str = interpolations[name]

      if (str) {
        return str
      } else {
        console.warn('[UIengine]', `Missing interpolation "${name}" for key "${key}"!`)
        return `[${name}]`
      }
    })
  } else if (localized) {
    return localized
  } else {
    console.warn('[UIengine]', `Missing localization for key "${key}"!`)
    return `[${key}]`
  }
}

// replace headings which resemble the component/page title
const decorateContent = pageOrComponent => {
  const { content, title } = pageOrComponent
  const regexp = new RegExp(`^<h1.*?>${title}</h1>`)

  return content.replace(regexp, '').trim()
}

const decorateCode = (code, lang) => {
  return highlight(code, lang)
}

const decorateContext = json => {
  return highlight(JSON.stringify(json, null, 2), 'json')
}

module.exports = {
  decorateCode,
  decorateContent,
  decorateContext,
  highlight,
  localize
}
