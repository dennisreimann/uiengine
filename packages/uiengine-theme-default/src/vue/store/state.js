import { createRoutes } from '../router'

const transformState = uiengineState => {
  const { entities, navigation } = uiengineState

  if (Object.keys(entities).length === 0 && navigation) {
    delete navigation.entities
  }

  return uiengineState
}

const initialState = transformState(window.UIengine.state)

const getters = {
  config: state => state.config,
  components: state => state.components,
  navigation: state => state.navigation,
  pages: state => state.pages,
  entities: state => state.entities,
  variants: state => state.variants
}

const mutations = {
  setState (state, uiengineState) {
    uiengineState = transformState(uiengineState)

    for (let property in uiengineState) {
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
