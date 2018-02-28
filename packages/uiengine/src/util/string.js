const titleize = string =>
  string
    .split(/\W+/gi)
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')

const titleFromContentHeading = content => {
  const [, title] = (content && content.match(/<h1.*?>(.*?)<\/h1>/)) || []

  return title
}

module.exports = {
  titleize,
  titleFromContentHeading
}
