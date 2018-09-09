import { createRoutes } from '../router'

const transformState = uiengineState => {
  const { entities, navigation } = uiengineState

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

  // eventually add entities
  if (Object.keys(entities).length > 0) {
    addIndexChild('entities', 'Entities')
  }

  // append settings
  addIndexChild('settings', 'Settings')

  return uiengineState
}

const initialState = transformState(window.UIengine.state)

const getters = {
  config: state => state.config,
  pages: state => state.pages,
  entities: state => state.entities,
  components: state => state.components,
  navigation: state => state.navigation
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
