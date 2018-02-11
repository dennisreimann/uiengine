import Vue from 'vue'
import store from './store'
import { dasherize } from '../util'

Vue.filter('dasherize', dasherize)

Vue.filter('localize', key => {
  const locale = store.getters['preferences/locale']
  const dict = window.UIengine.locales[locale]
  const localized = key.split('.').reduce((a, b) => a && a[b], dict)

  if (localized) {
    return localized
  } else {
    console.warn(`Missing localization for key "${key}"!`)
    return `[${key}]`
  }
})

Vue.filter('bool2string', bool => bool ? 'true' : 'false')
