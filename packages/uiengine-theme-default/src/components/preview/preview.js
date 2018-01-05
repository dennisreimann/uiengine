import { iframeResizer } from 'iframe-resizer'
import { debounce, relativePath } from '../../lib/util/common'
import { on } from '../../lib/util/browser'

// get breakpoints if they are configures
const breakpoints = window.UIengine.breakpoints || {}
const breakpointNames = Object.keys(breakpoints)
const breakpointWidths = Object.values ? Object.values(breakpoints) : Object.keys(breakpoints).map(k => breakpoints[k])

if (breakpoints) {
  const activeClass = 'preview__breakpoints--active'

  const toggleBreakpoints = breakpoints =>
    breakpoints.classList.toggle(activeClass)

  on('modal:close', 'body', () => {
    document.querySelectorAll('.preview__breakpoints').forEach(breakpoints => {
      breakpoints.classList.remove(activeClass)
    })
  })

  on('click', '.preview__sizer', e => {
    e.stopImmediatePropagation()

    const breakpointsSelector = e.target.getAttribute('data-breakpoints-target')
    const breakpoints = document.getElementById(breakpointsSelector)

    toggleBreakpoints(breakpoints)
  })

  on('click', '.preview__breakpoint', e => {
    const breakpoint = e.target
    const containerSelector = e.target.getAttribute('data-container-target')
    const container = document.getElementById(containerSelector)
    const width = breakpoint.getAttribute('data-width')
    const bpId = breakpoint.getAttribute('data-breakpoint')
    const id = container.getAttribute('data-preview-id')

    if (bpId) {
      // animate resizes
      const resizedHandler = () => {
        container.style.width = `${width}px`
        container.removeAttribute('data-breakpoint')
        container.removeEventListener('transitionend', resizedHandler)
      }
      container.addEventListener('transitionend', resizedHandler)
      container.setAttribute('data-breakpoint', bpId)
      container.style.width = null
      window.sessionStorage.setItem(`preview:width:${id}`, width)
    } else {
      // reset
      container.removeAttribute('data-breakpoint')
      container.style.width = null
      window.sessionStorage.removeItem(`preview:width:${id}`)
    }
  })
}

// iframe resizing, see https://github.com/davidjbradshaw/iframe-resizer
const iframeResizerOpts = { resizeFrom: 'child' }

const sizerTextForWidth = innerWidth => {
  let text = `${innerWidth}px`

  if (breakpoints) {
    const bps = breakpointWidths.filter(width => width <= innerWidth)
    const name = bps.length ? breakpointNames[bps.length - 1] : `< ${breakpointNames[0]}`
    text = `${name} @ ${text}`
  }

  return text
}

document.querySelectorAll('.preview__iframe').forEach(iframe => {
  const container = iframe.parentNode
  const sizer = container.firstElementChild.firstElementChild

  iframe.onload = () => {
    const { contentDocument, contentWindow } = iframe
    const head = contentDocument.getElementsByTagName('head')[0]
    const previewScript = document.createElement('script')

    previewScript.src = relativePath(iframe.getAttribute('src'), window.UIengine.previewScriptPath)

    head.appendChild(previewScript)

    iframeResizer(iframeResizerOpts, iframe)

    sizer.textContent = sizerTextForWidth(contentWindow.innerWidth)

    contentWindow.onresize = e => {
      debounce(`${iframe.id}-resize`, () => {
        sizer.textContent = sizerTextForWidth(e.target.innerWidth)
      }, 10)
    }
  }
})
