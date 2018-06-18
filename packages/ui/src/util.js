import highlightjs from 'highlight.js'

export const highlight = (code, lang) => {
  const languages = (lang != null) ? [lang] : undefined
  const { value, language } = highlightjs.highlightAuto(code, languages)
  const highlighted = `<pre class="hljs" lang="${lang || language}"><code>${value}</code></pre>`

  return highlighted
}

export const upcaseFirstChar = string => {
  return string.charAt(0).toUpperCase() + string.slice(1)
}

export const dasherize = string => {
  return String(string).replace(/\W+/gi, '-')
}

export const titleize = string => {
  return string
    .split(/\W+/gi)
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')
}

export const localize = (dict, key, interpolations) => {
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
export const decorateContent = pageOrComponent => {
  const { content, title } = pageOrComponent
  const regexp = new RegExp(`^<h1.*?>${title}</h1>`)

  return content.replace(regexp, '').trim()
}

export const decorateCode = (code, lang) => {
  return highlight(code, lang)
}

export const decorateContext = json => {
  return highlight(JSON.stringify(json, null, 2), 'json')
}
