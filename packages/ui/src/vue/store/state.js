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
  config: state => state.config,
  pages: state => state.pages,
  components: state => state.components,
  navigation: state => state.navigation
}

const mutations = {
  setState (state, uiengineState) {
    uiengineState = transformState(uiengineState)

    // FIXME: Remove once this is fixed https://github.com/eslint/eslint/issues/12117
    // eslint-disable-next-line no-unused-vars
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
