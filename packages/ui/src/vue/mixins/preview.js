export default {
  methods: {
    expandPreviewPath (pagePath) {
      const currentTheme = this.$store.getters['preferences/currentTheme']
      const themeHash = currentTheme ? `#${currentTheme.id}` : ''

      return `${window.UIengine.base}${pagePath}${themeHash}`
    }
  }
}
