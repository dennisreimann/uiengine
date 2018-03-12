import Vue from 'vue'
import store from './store'
import { dasherize, titleize, upcaseFirstChar } from '../util'

Vue.filter('dasherize', dasherize)

Vue.filter('upcaseFirstChar', upcaseFirstChar)

Vue.filter('titleize', titleize)

Vue.filter('localize', (key, interpolations) => {
  const locale = store.getters['preferences/locale']
  const dict = window.UIengine.locales[locale]
  const localized = key.split('.').reduce((a, b) => a && a[b], dict)

  if (localized && interpolations) {
    return localized.replace(/%\{(.+?)\}/g, (match, name) => {
      const str = interpolations[name]

      if (str) {
        return str
      } else {
        console.warn(`Missing interpolation "${name}" for key "${key}"!`)
        return `[${name}]`
      }
    })
  } else if (localized) {
    return localized
  } else {
    console.warn(`Missing localization for key "${key}"!`)
    return `[${key}]`
  }
})

Vue.filter('bool2string', bool => bool ? 'true' : 'false')
