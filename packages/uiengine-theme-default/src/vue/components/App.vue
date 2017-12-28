<template>
  <div id="app" class="layout">
    <app-navigation />
    <router-view/>
    <app-footer />
  </div>
</template>

<script>
import AppNavigation from './AppNavigation'
import AppFooter from './AppFooter'

export default {
  components: {
    AppNavigation,
    AppFooter
  }
}
</script>
