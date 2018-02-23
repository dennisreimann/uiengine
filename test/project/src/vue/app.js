import Vue from 'vue'

// import and assign all components that should be used for variant previews
import MyLabel from '../components/label/label.vue'

Vue.config.productionTip = false

export default function createApp (options = {}) {
  const opts = Object.assign({
    // provide all components that are needed for variant previews
    components: {
      MyLabel
    }
  }, options)

  return new Vue(opts)
}
