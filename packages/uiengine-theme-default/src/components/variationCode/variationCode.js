import { on } from '../../scripts/lib/util'

on('click', '.variation-code__toggle', e => {
  const toggle = e.target
  const blockSelector = toggle.getAttribute('data-block-target')
  const block = document.getElementById(blockSelector)

  block.classList.toggle('variation-code__block--active')
})
