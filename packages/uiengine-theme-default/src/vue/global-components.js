import Vue from 'vue'

// Because the navigation components are circular dependent they are registered globally, see:
// https://vuejs.org/v2/guide/components.html#Circular-References-Between-Components
import AppNavigationTree from './components/AppNavigationTree'
import AppNavigationItem from './components/AppNavigationItem'
import AppIcon from './components/AppIcon'

Vue.component('app-navigation-tree', AppNavigationTree)
Vue.component('app-navigation-item', AppNavigationItem)
Vue.component('app-icon', AppIcon)
