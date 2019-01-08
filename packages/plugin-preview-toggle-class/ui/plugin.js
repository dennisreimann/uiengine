document.addEventListener('plugin-preview-toggle-class:init', ({ detail }) => {
  const { plugin: { selector, className } } = detail

  if (!className || !selector) console.error('Please specify a selector and className to toggle.')
}, false)

document.addEventListener('plugin-preview-toggle-class:click', ({ detail }) => {
  const { iframe, plugin } = detail
  const { selector, className } = plugin

  if (!className || !selector) return console.error('Please specify a selector and className to toggle.')

  const el = iframe.contentDocument.querySelector(selector)

  if (el) {
    el.classList.toggle(className)
  } else {
    console.warn('Element could not be found in preview:', selector)
  }
}, false)
