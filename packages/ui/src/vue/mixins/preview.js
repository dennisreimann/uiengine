import { mapGetters } from 'vuex'

export default {
  computed: {
    ...mapGetters('state', ['config']),
    ...mapGetters('preferences', ['currentTheme']),

    displayAllThemes () {
      return this.currentTheme.id === '_all'
    },

    displayedThemes () {
      return this.displayAllThemes
        ? this.themes
        : [this.currentTheme]
    },

    themes () {
      return this.config.themes
    }
  }
}
