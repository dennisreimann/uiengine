import Vue from 'vue'
import Color from 'color'
import store from './store'
import { dasherize } from './util'

Vue.filter('dasherize', dasherize)

Vue.filter('localize', key => {
  const locale = store.getters['preferences/locale']
  const dict = window.UIengine.locales[locale]
  const localized = key.split('.').reduce((a, b) => a && a[b], dict)

  return localized || `[${key}]`
})

Vue.filter('colorValues', value => {
  const color = Color(value)

  return {
    hex: color.hex(),
    hsl: color.hsl(),
    rgb: color.rgb()
  }
})
