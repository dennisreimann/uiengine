// Dynamically import routes, leverage webpack code splitting.
// https://dzone.com/articles/code-splitting-with-vuejs-and-webpack
// https://dzone.com/articles/3-code-splitting-patterns-for-vuejs-and-webpack

export default [
  {
    path: '/',
    component: () => import(/* webpackChunkName: "home" */ '../components/AppPage')
  }
]
