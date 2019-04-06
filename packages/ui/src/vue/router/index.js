import Vue from 'vue'
import Router from 'vue-router'
import MainDocumentation from '../components/MainDocumentation'
import { upcaseFirstChar } from '@uiengine/util/src/string'

Vue.use(Router)

// Dynamically import route components to leverage webpack code splitting.
// https://dzone.com/articles/code-splitting-with-vuejs-and-webpack
// https://dzone.com/articles/3-code-splitting-patterns-for-vuejs-and-webpack
const mainComponent = type => {
  if (type === 'documentation') {
    return MainDocumentation
  }

  const componentName = upcaseFirstChar(type)

  return () => import(
    /* webpackPrefetch: true */
    /* webpackChunkName: "[request]" */
    `../components/Main${componentName}`
  )
}

const { base, mode } = window.UIengine.state.config.ui

const router = new Router({
  mode: mode || 'history',
  base: base || '/',
  scrollBehavior (to, _from, savedPosition) {
    if (to.hash) {
      return { selector: to.hash }
    } else if (savedPosition) {
      return savedPosition
    } else {
      return { x: 0, y: 0 }
    }
  },
  routes: [
    {
      name: 'search',
      path: '/_search/:query',
      props: true,
      component: mainComponent('search'),
      meta: { navItemId: '_search' }
    },
    {
      name: 'settings',
      path: '/_settings/',
      component: mainComponent('settings'),
      meta: { navItemId: '_settings' }
    },
    {
      path: '*',
      component: mainComponent('notFound')
    }
  ]
})

export default router

export const createRoutes = navigation => {
  const routes = Object.keys(navigation).map(navItemId => {
    const navItem = navigation[navItemId]

    return {
      path: navItem.path,
      component: mainComponent(navItem.type),
      meta: {
        navItemId: navItem.id,
        navItemTitle: navItem.title
      },
      props: {
        id: navItem.itemId
      }
    }
  })

  router.addRoutes(routes)
}

// create initial routes
createRoutes(window.UIengine.state.navigation)
