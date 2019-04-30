import Vue from 'vue'

export default function clientRender (Component, props) {
  return new Vue({
    el: '#app',
    render (h) {
      return h(Component, { props })
    }
  })
}
