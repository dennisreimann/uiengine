import '../components/contentheader/contentheader'
import '../components/navigation/navigation'
import '../components/variant/variantcode'
import '../components/variant/variantpreview'
import '../components/permalink/permalink'
import { trigger } from './lib/util'

document.body.addEventListener('click', e => {
  trigger('modal:close')
})
