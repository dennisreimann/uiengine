import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const initialState = {
  locale: null,
  config: null,
  navigation: null
}

const getters = {
  locale: state => state.locale,
  config: state => state.config,
  navigation: state => state.navigation
}

const mutations = {
  setLocale (state, locale) {
    state.locale = locale
  },

  setUiengineState (state, uiengineState) {
    for (let property in uiengineState) {
      state[property] = uiengineState[property]
    }
  }
}

const actions = {
  async fetchUiengineState ({ commit }) {
    const response = await window.fetch('/state.json')

    if (response.ok) {
      const data = await response.json()

      commit('setUiengineState', data)
    }

    return response
  }
}

// see https://vuex.vuejs.org/en/structure.html
export default new Vuex.Store({
  state: initialState,
  getters,
  mutations,
  actions
})
