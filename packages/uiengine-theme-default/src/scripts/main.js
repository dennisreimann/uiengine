import '../components/variationheader/variationheader'
import '../components/variationpreview/variationpreview'
import '../components/variationcode/variationcode'
import '../components/permalink/permalink'
import { trigger } from './lib/util'

document.body.addEventListener('click', e => {
  trigger('modal:close')
})
