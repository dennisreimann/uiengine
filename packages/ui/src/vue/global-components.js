import Vue from 'vue'

import AppIcon from './components/AppIcon'

// Because the navigation components are circular dependent they are registered globally, see:
// https://vuejs.org/v2/guide/components.html#Circular-References-Between-Components
import AppNavigationTree from './components/AppNavigationTree'
import AppNavigationItem from './components/AppNavigationItem'
import ContentProperty from './components/ContentProperty'

Vue.component('AppIcon', AppIcon)
Vue.component('AppNavigationTree', AppNavigationTree)
Vue.component('AppNavigationItem', AppNavigationItem)
Vue.component('ContentProperty', ContentProperty)
