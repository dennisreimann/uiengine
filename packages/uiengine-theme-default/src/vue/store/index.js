import Vue from 'vue'
import Vuex from 'vuex'
import state from './state'
import preferences from './preferences'

Vue.use(Vuex)

const modules = {
  state,
  preferences
}

// see https://vuex.vuejs.org/en/structure.html
export default new Vuex.Store({
  modules
})
