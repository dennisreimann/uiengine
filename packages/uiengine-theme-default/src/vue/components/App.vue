<template>
  <div id="app" class="layout">
    <app-navigation />
    <app-main />
    <app-footer />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import AppNavigation from './AppNavigation'
import AppFooter from './AppFooter'
import AppMain from './AppMain'

export default {
  components: {
    AppNavigation,
    AppFooter,
    AppMain
  },

  metaInfo () {
    const config = this.$store.getters['state/config']
    const siteTitle = config ? `${config.name} (${config.version})` : ''

    return {
      titleTemplate (pageTitle) {
        return pageTitle ? `${pageTitle} • ${siteTitle}` : siteTitle
      }
    }
  }
}
</script>
