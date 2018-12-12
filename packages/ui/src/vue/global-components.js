import Vue from 'vue'

// Because the navigation components are circular dependent they are registered globally, see:
// https://vuejs.org/v2/guide/components.html#Circular-References-Between-Components
import AppNavigationTree from './components/AppNavigationTree'
import AppNavigationItem from './components/AppNavigationItem'
import AppIcon from './components/AppIcon'

Vue.component('AppNavigationTree', AppNavigationTree)
Vue.component('AppNavigationItem', AppNavigationItem)
Vue.component('AppIcon', AppIcon)
