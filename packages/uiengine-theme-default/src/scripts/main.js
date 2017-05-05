import '../components/component/component'
import '../components/variant/variant'
import '../components/variantpreview/variantpreview'
import '../components/variantcode/variantcode'
import '../components/permalink/permalink'
import { trigger } from './lib/util'

document.body.addEventListener('click', e => {
  trigger('modal:close')
})
