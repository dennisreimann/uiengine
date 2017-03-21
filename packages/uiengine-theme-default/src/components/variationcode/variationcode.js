import { on } from '../../scripts/lib/util'

on('click', '.variationcode__toggle', e => {
  const toggle = e.target
  const blockSelector = toggle.getAttribute('data-block-target')
  const block = document.getElementById(blockSelector)

  toggle.classList.toggle('variationcode__toggle--active')
  block.classList.toggle('variationcode__block--active')
})
