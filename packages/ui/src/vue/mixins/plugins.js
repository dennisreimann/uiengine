import { mapGetters } from 'vuex'

export default {
  computed: {
    ...mapGetters('state', ['plugins']),

    pluginActions () {
      return this.plugins.ui.actions
    },

    pluginTabs () {
      return this.plugins.ui.tabs
    }
  },

  methods: {
    dispatchPluginEvent (type, plugin, payload) {
      this.$refs.preview.dispatchPluginEvent(type, plugin, payload)
    },

    dispatchPluginEventForAllPlugins (type, plugin, payload) {
      this.$refs.preview.dispatchPluginEvent(type, plugin, payload)
    }
  },

  mounted () {
    this.$refs.preview.$on('iframe:load', iframe => {
      this.pluginActions.forEach((plugin, index) => {
        const target = this.$refs['plugin-action'][index]
        this.dispatchPluginEvent('iframe:load', plugin, { target, iframe })
      })

      this.pluginTabs.forEach((plugin, index) => {
        const target = this.$refs['plugin-tab'][index]
        const content = this.$refs['plugin-tab-content'][index]
        this.dispatchPluginEvent('iframe:load', plugin, { target, content, iframe })
      })
    })

    this.pluginActions.forEach((plugin, index) => {
      const target = this.$refs['plugin-action'][index]
      this.dispatchPluginEvent('init', plugin, { target })
    })

    this.pluginTabs.forEach((plugin, index) => {
      const target = this.$refs['plugin-tab'][index]
      const content = this.$refs['plugin-tab-content'][index]
      this.dispatchPluginEvent('init', plugin, { target, content })
    })
  }
}
