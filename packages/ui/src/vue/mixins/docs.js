export default {
  methods: {
    findFileLink (componentOrPage) {
      const isLocal = !!window.___browserSync___

      const { readmeFile, sourceFile, sourcePath } = componentOrPage
      const pathUrl = readmeFile || sourceFile || sourcePath

      if (isLocal) {
        const { base } = this.config.source

        return `vscode://file/${base}/${pathUrl}`
      } else {
        const { repoBaseUrl } = this.config.ui
        if (!repoBaseUrl) return null

        return `${repoBaseUrl}${pathUrl}`
      }
    }
  }
}
