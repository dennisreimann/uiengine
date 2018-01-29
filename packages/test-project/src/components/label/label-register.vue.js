import Vue from 'vue'
import props from './props'

Vue.component('my-label', {
  props,

  template: '<label class="label" :for="id">{{ title }}</label>'
})
