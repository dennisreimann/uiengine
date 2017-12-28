import Vue from 'vue'
import Router from 'vue-router'
import { upcaseFirstChar } from '../util'

Vue.use(Router)

// Dynamically import route components to leverage webpack code splitting.
// https://dzone.com/articles/code-splitting-with-vuejs-and-webpack
// https://dzone.com/articles/3-code-splitting-patterns-for-vuejs-and-webpack
const componentForType = type => {
  const componentName = upcaseFirstChar(type)

  return () => import(`../components/AppMain${componentName}`)
}

const router = new Router({
  mode: 'history',
  routes: [
    {
      path: '*',
      component: componentForType('notFound')
    }
  ]
})

export default router

export const createRoutes = navigation => {
  const routes = Object.keys(navigation).map(navItemId => {
    const navItem = navigation[navItemId]

    return {
      path: navItem.path,
      component: componentForType(navItem.type),
      meta: navItem,
      props: {
        id: navItem.itemId
      }
    }
  })

  router.addRoutes(routes)
}
