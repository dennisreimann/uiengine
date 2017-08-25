import '../components/code/code'
import '../components/contentheader/contentheader'
import '../components/navigation/navigation'
import '../components/permalink/permalink'
import '../components/preview/preview'
import { trigger } from './lib/util'

document.body.addEventListener('click', e => {
  trigger('modal:close')
})
