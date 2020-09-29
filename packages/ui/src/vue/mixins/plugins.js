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
    const { variant, component } = this.$props
    this.$refs.preview.$on('iframe-load', iframe => {
      this.pluginActions.forEach((plugin, index) => {
        const target = this.$refs['plugin-action'][index]
        this.dispatchPluginEvent('init', plugin, { target, variant, component })
        this.dispatchPluginEvent('iframe-load', plugin, { target, variant, component, iframe })
      })

      this.pluginTabs.forEach((plugin, index) => {
        const target = this.$refs['plugin-tab'][index]
        const content = this.$refs['plugin-tab-content'][index]
        this.dispatchPluginEvent('init', plugin, { target, content, variant, component })
        this.dispatchPluginEvent('iframe-load', plugin, { target, content, variant, component, iframe })
      })
    })
  }
}
