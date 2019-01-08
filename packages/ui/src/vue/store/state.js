import { createRoutes } from '../router'

const transformState = uiengineState => {
  const { navigation } = uiengineState

  const addIndexChild = (id, title) => {
    navigation[id] = {
      id: id,
      itemId: id,
      parentId: 'index',
      path: `/_${id}/`,
      type: id,
      localizedTitleKey: `${id}.title`,
      title
    }
    navigation.index.childIds.push(id)
  }

  // append settings
  addIndexChild('settings', 'Settings')

  return uiengineState
}

const initialState = transformState(window.UIengine.state)

const getters = {
  pages: state => state.pages,
  config: state => state.config,
  plugins: state => state.plugins,
  components: state => state.components,
  navigation: state => state.navigation
}

const mutations = {
  setState (state, uiengineState) {
    uiengineState = transformState(uiengineState)

    for (const property in uiengineState) {
      state[property] = uiengineState[property]
    }

    const { navigation } = uiengineState
    if (navigation) {
      createRoutes(navigation)
    }
  }
}

const actions = {
}

export default {
  namespaced: true,
  state: initialState,
  getters,
  mutations,
  actions
}
