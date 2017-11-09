import Vue from 'vue'

Vue.component('my-label', {
  props: {
    id: String,
    title: String
  },
  template: '<label class="label" :for="id">{{ title }}</label>'
})
