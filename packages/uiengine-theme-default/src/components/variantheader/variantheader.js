import { on, trigger } from '../../scripts/lib/util'

on('click', '.variantheader__link', e => {
  e.preventDefault()

  const link = e.target
  const targetSelector = link.getAttribute('href').substring(1)
  const target = document.getElementById(targetSelector)
  const links = link.parentNode.children
  const sections = target.parentNode.children

  for (let i = 0; i < links.length; i++) {
    const item = links[i]
    const op = (item === link) ? 'add' : 'remove'
    item.classList[op]('variantheader__link--active')
  }

  for (let i = 0; i < sections.length; i++) {
    const section = sections[i]
    const op = (section === target) ? 'add' : 'remove'
    section.classList[op]('variant__section--active')
  }
})

const activeClass = 'variantheader__actionlist--active'

const toggleActionlist = (actionlist) =>
  actionlist.classList.toggle(activeClass)

on('modal:close', 'body', e => {
  document.querySelectorAll('.variantheader__actionlist').forEach(actionlist => {
    actionlist.classList.remove(activeClass)
  })
})

on('click', '.variantheader__actiontoggle', e => {
  e.stopImmediatePropagation()

  let el = e.target
  while (!el.matches('.variantheader__actiontoggle')) { el = el.parentNode }

  const actionlistSelector = el.getAttribute('data-actionlist-target')
  const actionlist = document.getElementById(actionlistSelector)

  toggleActionlist(actionlist)
})
