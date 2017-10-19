import { on } from '../../lib/util/browser'

const actionlistActiveClass = 'contentheader__actionlist--active'

const toggleActionlist = actionlist =>
  actionlist.classList.toggle(actionlistActiveClass)

on('modal:close', 'body', e => {
  document.querySelectorAll('.contentheader__actionlist').forEach(actionlist => {
    actionlist.classList.remove(actionlistActiveClass)
  })
})

on('click', '.contentheader__actiontoggle', e => {
  e.stopImmediatePropagation()

  let el = e.target
  while (!el.matches('.contentheader__actiontoggle')) { el = el.parentNode }

  const actionlistSelector = el.getAttribute('data-actionlist-target')
  const actionlist = document.getElementById(actionlistSelector)

  toggleActionlist(actionlist)
})

// CodePen API documentation:
// https://blog.codepen.io/documentation/api/prefill/
on('click', '.contentheader__actionlink--codepen', e => {
  e.preventDefault()

  const link = e.target
  const variantId = link.getAttribute('data-variant-target')
  const variantNode = document.getElementById(variantId)
  const iframeDocument = variantNode.querySelector('iframe').contentDocument
  const { styleSheets, scripts } = iframeDocument
  const form = link.parentNode
  const input = link.previousSibling
  const value = JSON.parse(input.dataset.value)

  let css = ''
  let cssExt = ''
  let js = ''
  let jsExt = ''

  for (let i = 0; i < styleSheets.length; i++) {
    const styleSheet = styleSheets[i]
    if (styleSheet.href) {
      cssExt += `${styleSheet.href};`
    } else {
      css += [].slice.call(styleSheet.cssRules).reduce((prev, cssRule) => prev + cssRule.cssText, '')
    }
  }

  for (let i = 0; i < scripts.length; i++) {
    const script = scripts[i]
    if (script.src) {
      jsExt += `${script.src};`
    } else if (script.id !== '__bs_script__') {
      js += script.innerHTML
    }
  }

  const data = Object.assign({}, value, { css, css_external: cssExt, js, js_external: jsExt })

  input.setAttribute('value', JSON.stringify(data))

  form.submit()
})

on('click', '.contentheader__option', e => {
  e.preventDefault()

  const link = e.target
  const targetSelector = link.getAttribute('href').substring(1)
  const target = document.getElementById(targetSelector)
  const links = link.parentNode.children
  const sections = target.parentNode.children

  for (let i = 0; i < links.length; i++) {
    const item = links[i]
    const op = (item === link) ? 'add' : 'remove'
    item.classList[op]('contentheader__option--active')
  }

  for (let i = 0; i < sections.length; i++) {
    const section = sections[i]
    const op = (section === target) ? 'add' : 'remove'
    section.classList[op]('contentsection--active')
  }
})
