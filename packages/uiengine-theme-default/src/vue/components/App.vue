<template>
  <div
    id="app"
    class="layout"
    @click="closeModals"
  >
    <app-navigation />
    <app-main />
    <app-footer />
  </div>
</template>

<script>
import AppNavigation from './AppNavigation'
import AppFooter from './AppFooter'
import AppMain from './AppMain'

export default {
  components: {
    AppNavigation,
    AppFooter,
    AppMain
  },

  methods: {
    closeModals () {
      this.$root.$emit('modal:close')
    }
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

<style>
@font-face {
  font-family: merriweathersans-bold;
  src: url(../../fonts/merriweathersans-bold.woff2) format("woff2"),
       url(../../fonts/merriweathersans-bold.woff) format("woff");
  font-display: optional
}

@font-face {
  font-family: merriweathersans-light;
  src: url(../../fonts/merriweathersans-light.woff2) format("woff2"),
       url(../../fonts/merriweathersans-light.woff) format("woff");
  font-display: optional
}

@font-face {
  font-family: merriweathersans-regular;
  src: url(../../fonts/merriweathersans-regular.woff2) format("woff2"),
       url(../../fonts/merriweathersans-regular.woff) format("woff");
  font-display: optional
}
</style>
