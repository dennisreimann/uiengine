import Vue from 'vue'
import Router from 'vue-router'
import { upcaseFirstChar } from '../../util'

Vue.use(Router)

// Dynamically import route components to leverage webpack code splitting.
// https://dzone.com/articles/code-splitting-with-vuejs-and-webpack
// https://dzone.com/articles/3-code-splitting-patterns-for-vuejs-and-webpack
const mainComponent = type => {
  const componentName = upcaseFirstChar(type)

  return () => import(`../components/Main${componentName}`)
}

const router = new Router({
  mode: 'history',
  routes: [
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
      meta: navItem,
      props: {
        id: navItem.itemId
      }
    }
  })

  router.addRoutes(routes)
}

// create initial routes
createRoutes(window.UIengine.state.navigation)
