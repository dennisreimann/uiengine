import { on } from '../../lib/util/browser'

on('click', '.navigation__menutoggle', e => {
  e.preventDefault()

  const button = e.target
  const targetId = button.getAttribute('data-target')
  const target = document.getElementById(targetId)

  const collapsed = target.classList.toggle('navigation--collapsed')

  window.sessionStorage.setItem('uiengine-navigation-collapsed', collapsed)
})

on('click', '.navigation__itemtoggle', e => {
  e.preventDefault()

  const button = e.target
  const targetId = button.getAttribute('data-target')
  const target = document.getElementById(targetId)

  const collapsed = target.classList.toggle('navigation__item--collapsed')

  window.sessionStorage.setItem(`${targetId}-collapsed`, collapsed)
})
