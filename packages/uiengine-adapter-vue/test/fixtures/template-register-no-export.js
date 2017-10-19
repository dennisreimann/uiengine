import Vue from 'vue'

Vue.component('test-template', {
  props: ['myData'],
  template: '<p>{{ myData }}</p>'
})
