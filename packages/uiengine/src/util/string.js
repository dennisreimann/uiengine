const HEADING_REGEXP = /^<h1.*?>(.*?)<\/h1>/
const EXCERPT_REGEXP = /(<(p|ul|ol).*?>(.*?)<\/\2>)/

const titleize = string =>
  string
    .split(/\W+/gi)
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')

const hasContent = content =>
  !!content && content.replace(HEADING_REGEXP, '').trim().length > 0

const titleFromContentHeading = content => {
  const [, title] = (content && content.match(HEADING_REGEXP)) || []

  return title
}

const excerptFromContent = content => {
  const [, excerpt] = (content && content.match(EXCERPT_REGEXP)) || []

  return excerpt
}

module.exports = {
  titleize,
  titleFromContentHeading,
  hasContent,
  excerptFromContent
}
