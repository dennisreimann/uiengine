const setThemeFromURL = function (urlString) {
  const url = new window.URL(urlString)
  const theme = (url.hash && url.hash.replace(/^#/, '')) || 'plain'

  const stylesheet = document.getElementById('theme-stylesheet')
  if (stylesheet) {
    const template = stylesheet.dataset['template']
    const themeCssUrl = template.replace('%s', theme)
    stylesheet.href = themeCssUrl
  }

  document.documentElement.dataset['theme'] = theme
}

setThemeFromURL(window.location.href)

window.addEventListener('hashchange', function (event) {
  setThemeFromURL(event.newURL)
})

console.log('JavaScript loaded')
