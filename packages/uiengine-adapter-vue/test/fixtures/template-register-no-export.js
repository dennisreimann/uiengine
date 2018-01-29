import Vue from 'vue'
import props from './props'

Vue.component('test-template', {
  props,

  template: '<p>{{ myData }}</p>'
})
