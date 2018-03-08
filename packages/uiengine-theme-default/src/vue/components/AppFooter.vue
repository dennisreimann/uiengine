<template>
  <footer
    v-if="config"
    class="footer"
  >
    <p
      v-if="config.copyright"
      class="footer__copyright"
      v-html="config.copyright"
    />
    <p
      v-if="config.version"
      class="footer__version"
    >
      {{ 'footer.version' | localize }} {{ config.version }} –
      {{ 'footer.last_update' | localize }} {{ lastUpdate }}.
    </p>
  </footer>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  computed: {
    ...mapGetters('state', ['config']),
    ...mapGetters('preferences', ['locale']),

    lastUpdate () {
      return new Date(this.config.update).toLocaleString(this.locale)
    }
  }
}
</script>

<style lang="stylus">
.footer
  color var(--color-footer-text)
  background var(--color-footer-bg)
  font-size var(--font-size-xs)
  padding-top var(--space-l)
  padding-bottom var(--space-l)

  a
    color var(--color-footer-text)
</style>

<docs>
Appears at the bottom of each page.
Contains the copyright and version information, as well as the date of the last update.
</docs>
