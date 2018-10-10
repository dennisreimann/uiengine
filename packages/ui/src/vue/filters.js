import Vue from 'vue'
import store from './store'
import { dasherize, titleize, upcaseFirstChar } from '@uiengine/util/src/string'
import { localize } from '../util'
import { LOCALES } from './util'

Vue.filter('dasherize', dasherize)

Vue.filter('upcaseFirstChar', upcaseFirstChar)

Vue.filter('titleize', titleize)

Vue.filter('bool2string', bool => bool ? 'true' : 'false')

Vue.filter('localize', (key, interpolations) => {
  const id = store.getters['preferences/locale']
  const dict = LOCALES[id]

  return localize(dict, key, interpolations)
})
