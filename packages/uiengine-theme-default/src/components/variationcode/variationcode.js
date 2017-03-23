import { on } from '../../scripts/lib/util'

on('click', '.variationcode__header', e => {
  const toggle = e.target
  const sectionSelector = toggle.getAttribute('data-section-target')
  const section = document.getElementById(sectionSelector)

  section.classList.toggle('variationcode__section--expanded')
})
