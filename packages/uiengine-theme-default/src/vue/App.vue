<template>
  <div id="app" class="layout">
    <app-navigation />
    <router-view/>
    <app-footer />
  </div>
</template>

<script>
import AppNavigation from '@/components/AppNavigation'
import AppFooter from '@/components/AppFooter'

export default {
  components: {
    AppNavigation,
    AppFooter
  }
}
</script>
