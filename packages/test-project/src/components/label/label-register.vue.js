import Vue from 'vue'

Vue.component('my-label', {
  template: '<label class="label" :for="for">{{ title }}</label>'
})
