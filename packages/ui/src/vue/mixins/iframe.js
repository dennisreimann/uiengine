import { iframeResizer } from 'iframe-resizer'

// iframe resizing, see https://github.com/davidjbradshaw/iframe-resizer
const iframeResizerOpts = { resizeFrom: 'child', checkOrigin: false }

export default {
  data () {
    return {
      isBreakpointsActive: false,
      iframeWidth: null
    }
  },

  methods: {
    resizableIframe (iframe) {
      iframe.addEventListener('load', this.setupIframe.bind(this))
    },

    setupIframe (event) {
      const iframe = event.currentTarget
      const height = iframe.getAttribute('height')

      if (!height) {
        const { contentWindow } = iframe

        // dynamically add runtime and iframe sizer scripts
        this.addScriptToIframe(window.UIengine.runtimeSrc, iframe)
        this.addScriptToIframe(window.UIengine.previewSrc, iframe)

        // initialize iframe sizer
        iframeResizer(iframeResizerOpts, iframe)

        // set initial iframe width and update it on resize
        this.iframeWidth = contentWindow.innerWidth
        contentWindow.onresize = this.iframeResizeHandler.bind(this)
      }
    },

    iframeResizeHandler (event) {
      const { innerWidth } = event.target
      this.iframeWidth = innerWidth
    },

    addScriptToIframe (scriptSrc, iframe) {
      const { contentDocument } = iframe
      const head = contentDocument.getElementsByTagName('head')[0]
      const script = document.createElement('script')
      script.src = scriptSrc
      // script tags inserted via js load async by default. prevent this by explicitly
      // turning off async loading to ensure the correct loading order.
      script.async = false
      head.appendChild(script)
    }
  }
}
