import Clipboard from 'clipboard'
import { on } from '../../scripts/lib/util'

const clipboardTextAttr = 'data-clipboard-text'
const permalinkCopiedClass = 'permalink--copied'
const permalinkSelector = '.permalink'

document.querySelectorAll(permalinkSelector).forEach(permalink => {
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

on('click', permalinkSelector, e => e.preventDefault())
