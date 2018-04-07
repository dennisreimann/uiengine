const setThemeFromURL = function (urlString) {
  const url = new window.URL(urlString)
  const theme = (url.hash && url.hash.replace(/^#/, '')) || 'default'

  document.documentElement.className = `theme-${theme}`
}

setThemeFromURL(window.location.href)

window.addEventListener('hashchange', function (event) {
  setThemeFromURL(event.newURL)
})

console.log('JavaScript loaded')
