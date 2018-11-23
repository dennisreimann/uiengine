const HEADING_REGEXP = /^<h1.*?>(.*?)<\/h1>/

const titleize = string =>
  string
    .split(/\W+/gi)
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')

const dasherize = string =>
  String(string).replace(/\W+/gi, '-')

const lowercaseFirstChar = string =>
  string.charAt(0).toLowerCase() + string.slice(1)

const upcaseFirstChar = string =>
  string.charAt(0).toUpperCase() + string.slice(1)

const hasContent = content =>
  !!content && content.replace(HEADING_REGEXP, '').trim().length > 0

const replaceTemplateComments = (html, marks) =>
  Object.keys(marks).reduce((current, key) => {
    const regexp = new RegExp(`<!--\\s?uiengine:${key}\\s?-->`, 'gi')
    const content = marks[key]
    return current.replace(regexp, content)
  }, html)

const titleFromContentHeading = content => {
  const [, title] = (content && content.match(HEADING_REGEXP)) || []

  return title
}

const crossPlatformPath = id =>
  id.replace(/\\/g, '/')

module.exports = {
  crossPlatformPath,
  dasherize,
  titleize,
  upcaseFirstChar,
  lowercaseFirstChar,
  hasContent,
  replaceTemplateComments,
  titleFromContentHeading
}
