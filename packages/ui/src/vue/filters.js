import Vue from 'vue'
import store from './store'
import { dasherize, titleize, upcaseFirstChar } from '@uiengine/util/lib/string'
import { localize } from '../util'

Vue.filter('dasherize', dasherize)

Vue.filter('upcaseFirstChar', upcaseFirstChar)

Vue.filter('titleize', titleize)

Vue.filter('bool2string', bool => bool ? 'true' : 'false')

Vue.filter('localize', (key, interpolations) => {
  const locale = store.getters['preferences/locale']
  const dict = window.UIengine.locales[locale]

  return localize(dict, key, interpolations)
})
