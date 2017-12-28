<template>
  <footer class="footer" v-if="config">
    <p class="footer__copyright" v-if="config.copyright" v-html="config.copyright" />
    <p class="footer__version" v-if="config.version">
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
