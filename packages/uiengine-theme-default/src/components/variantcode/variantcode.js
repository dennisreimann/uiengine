import { on } from '../../scripts/lib/util'

on('click', '.variantcode__header', e => {
  let section = e.target.parentNode
  while (!section.matches('.variantcode__segment')) { section = section.parentNode }

  section.classList.toggle('variantcode__segment--expanded')
})
