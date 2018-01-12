import highlightjs from 'highlight.js'

export const highlight = (code, lang) => {
  const languages = (lang != null) ? [lang] : undefined
  const { value } = highlightjs.highlightAuto(code, languages)
  const highlighted = `<pre class="hljs" lang="${lang}">${value}</pre>`

  return highlighted
}

export const upcaseFirstChar = string => {
  return string.charAt(0).toUpperCase() + string.slice(1)
}

export const dasherize = string => {
  return String(string).replace(/\W+/gi, '-')
}

// replace headings which resemble the page title
export const decoratePageContent = page => {
  const { content, title } = page
  const regexp = new RegExp(`^<h1.*?>${title}</h1>`)

  return content.replace(regexp, '').trim()
}

export const decorateRaw = (code, lang) => {
  return highlight(code, lang)
}

export const decorateContext = json => {
  return highlight(JSON.stringify(json, null, 2), 'json')
}

export const decorateRendered = html => {
  return highlight(html, 'html')
}
