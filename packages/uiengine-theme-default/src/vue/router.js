import Vue from 'vue'
import Router from 'vue-router'
import { default as routes } from './routes'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes
})
