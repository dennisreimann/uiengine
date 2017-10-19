import Vue from 'vue'

export default Vue.component('test-template', {
  props: ['myData'],
  template: '<p>{{ myData }}</p>'
})
