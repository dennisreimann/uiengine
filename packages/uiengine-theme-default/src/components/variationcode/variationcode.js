import { on } from '../../scripts/lib/util'

on('click', '.variationcode__header', e => {
  let section = e.target.parentNode
  while (!section.matches('.variationcode__section')) { section = section.parentNode }

  section.classList.toggle('variationcode__section--expanded')
})
