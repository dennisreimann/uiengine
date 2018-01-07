import { createRoutes } from '../router'

const transformState = uiengineState => {
  const { schema, navigation } = uiengineState

  if (Object.keys(schema).length === 0 && navigation) {
    delete navigation.schema
  }

  return uiengineState
}

const initialState = transformState(window.UIengine.state)

const getters = {
  config: state => state.config,
  components: state => state.components,
  navigation: state => state.navigation,
  pages: state => state.pages,
  schema: state => state.schema,
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
