import { iframeResizer } from 'iframe-resizer'
import Clipboard from 'clipboard'

// split this up to make the revving work
const previewScriptPath = 'scripts/uiengine-preview.js'
const previewScriptSrc = `../../_uiengine-theme/${previewScriptPath}`

// iframe resizing, see https://github.com/davidjbradshaw/iframe-resizer
const iframeResizerOpts = {}
const iframesSelector = '.variation-preview__iframe'

document.querySelectorAll(iframesSelector).forEach(iframe => {
  iframe.onload = function (e) {
    const doc = iframe.contentDocument
    const head = doc.getElementsByTagName('head')[0]
    const previewScript = document.createElement('script')
    previewScript.src = previewScriptSrc

    head.appendChild(previewScript)

    iframeResizer(iframeResizerOpts, iframe)
  }
})

// variation header links
const variationHeaderLinkSelector = '.variation-header__link'
const variationHeaderLinkActiveClass = 'variation-header__link--active'
const variationSectionActiveClass = 'variation__section--active'

document.querySelectorAll(variationHeaderLinkSelector).forEach(link => {
  link.addEventListener('click', e => {
    console.log(link)
    const targetSelector = link.getAttribute('href').substring(1)
    const target = document.getElementById(targetSelector)
    const links = link.parentNode.children
    const sections = target.parentNode.children

    for (let i = 0; i < links.length; i++) {
      const item = links[i]
      const op = (item === link) ? 'add' : 'remove'
      item.classList[op](variationHeaderLinkActiveClass)
    }

    for (let i = 0; i < sections.length; i++) {
      const section = sections[i]
      const op = (section === target) ? 'add' : 'remove'
      console.log(op, section)
      section.classList[op](variationSectionActiveClass)
    }

    e.preventDefault()
  })
})

// code toggles
const codeToggleSelector = '.variation-code__toggle'

document.querySelectorAll(codeToggleSelector).forEach(toggle => {
  toggle.addEventListener('click', e => {
    const targetSelector = toggle.getAttribute('data-target')
    const target = document.getElementById(targetSelector)

    target.classList.toggle('variation-code__block--hidden')
  })
})

// permalinks
const clipboardTextAttr = 'data-clipboard-text'
const permalinkCopiedClass = 'permalink--copied'
const permalinkSelector = '.permalink'

document.querySelectorAll(permalinkSelector).forEach(permalink => {
  permalink.addEventListener('click', e => e.preventDefault())

  // convert anchor into full url
  const clipboardText = permalink.getAttribute(clipboardTextAttr)
  if (clipboardText.charAt(0) === '#') {
    const loc = window.location
    const txt = `${loc.protocol}//${loc.host}${loc.pathname}${clipboardText}`
    permalink.setAttribute(clipboardTextAttr, txt)
  }
})

new Clipboard(permalinkSelector)
  .on('success', e => {
    const item = e.trigger
    item.classList.add(permalinkCopiedClass)

    window.setTimeout(() => item.classList.remove(permalinkCopiedClass), 2500)
    e.clearSelection()
  })
  .on('error', e => {
    console.error('Clipboard error:', e)
  })
