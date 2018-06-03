const HEADING_REGEXP = /^<h1.*?>(.*?)<\/h1>/

export const titleize = string =>
  string
    .split(/\W+/gi)
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')

export const dasherize = string =>
  String(string).replace(/\W+/gi, '-')

export const hasContent = content =>
  !!content && content.replace(HEADING_REGEXP, '').trim().length > 0

export const titleFromContentHeading = content => {
  const [, title] = (content && content.match(HEADING_REGEXP)) || []

  return title
}
