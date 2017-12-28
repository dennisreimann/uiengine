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

  return content.replace(regexp, '')
}
