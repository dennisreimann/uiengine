import { on } from '../../scripts/lib/util'

on('click', '.code__header', e => {
  let section = e.target.parentNode
  while (!section.matches('.code__segment')) { section = section.parentNode }

  section.classList.toggle('code__segment--expanded')
})
