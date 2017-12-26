import Vue from 'vue'
import store from './store'

Vue.filter('localize', key => {
  const { locale } = store.getters
  const dict = window.UIengine.locales[locale]
  const localized = key.split('.').reduce((a, b) => a && a[b], dict)

  return localized || `[${key}]`
})

Vue.filter('dasherize', string => {
  return String(string).replace(/\W+/gi, '-')
})
