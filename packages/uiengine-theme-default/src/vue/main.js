// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Meta from 'vue-meta'
import App from './components/App'
import router from './router'
import store from './store'
import './filters'
import './global-components'

Vue.config.productionTip = false
Vue.use(Meta)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App },
  beforeCreate () {
    this.$store.commit('setLocale', document.documentElement.getAttribute('lang'))
    this.$store.dispatch('fetchUiengineState')
  }
})
