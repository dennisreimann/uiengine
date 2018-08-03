import { upcaseFirstChar } from '@uiengine/util/lib/string'

const appState = window.UIengine.state
const ui = appState.config && appState.config.ui

const properties = {
  hljs: document.getElementById('hljs').getAttribute('data-default'),
  locale: document.documentElement.getAttribute('lang'),
  currentTheme: (ui && ui.themes && ui.themes[0]),
  navigationCollapsed: false,
  navigationItemsCollapsed: {},
  searchCollapsed: true,
  previewWidths: {},
  previewMode: (ui && ui.defaultPreviewMode) || 'breakpoints'
}

// https://vuejs.org/v2/guide/reactivity.html#Change-Detection-Caveats
const reactiveValue = value => {
  if (typeof value === 'object') {
    return value instanceof Array ? value : Object.assign({}, value)
  } else {
    return value
  }
}

// web storage access
const getSession = (key, defaultValue) => {
  const value = window.sessionStorage.getItem(`uiengine/${key}`)
  return value ? JSON.parse(value) : defaultValue
}

const setSession = (key, value) => {
  if (value || typeof value === 'boolean') {
    window.sessionStorage.setItem(`uiengine/${key}`, JSON.stringify(value))
  } else {
    window.sessionStorage.removeItem(`uiengine/${key}`)
  }

  return value
}

// create state, getters and mutations based on properties;
// get initial state from session storage
const initialState = Object.keys(properties).reduce((obj, property) => {
  const defaultValue = properties[property]
  obj[property] = getSession(property, defaultValue)

  return obj
}, {})

const getters = Object.keys(properties).reduce((obj, property) => {
  obj[property] = state => state[property]

  return obj
}, {})

const mutations = Object.keys(properties).reduce((obj, property) => {
  const upcased = upcaseFirstChar(property)
  const setter = `set${upcased}`

  obj[setter] = (state, value) => {
    // set value in session storage
    setSession(property, value)

    state[property] = reactiveValue(value)
  }

  return obj
}, {})

// preferences are set synchronously, hence no actions
const actions = {
}

export default {
  namespaced: true,
  state: initialState,
  getters,
  mutations,
  actions
}
