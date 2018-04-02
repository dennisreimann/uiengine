import Vue from 'vue'
import props from './props'

export default Vue.component('test-template', {
  props,

  template: '<p>{{ myData }}</p>'
})
