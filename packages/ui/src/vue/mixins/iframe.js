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
    mountResizableIframe (iframe) {
      iframe.addEventListener('load', this.setupIframe.bind(this))
    },

    unmountResizableIframe (iframe) {
      if (iframe.iFrameResizer) iframe.iFrameResizer.close()
      iframe.removeEventListener('load', this.setupIframe.bind(this))
    },

    setupIframe (event) {
      const iframe = event.currentTarget
      const height = iframe.getAttribute('height')

      if (!height && iframe.src !== 'about:blank') {
        const { contentWindow } = iframe

        // dynamically add runtime and iframe sizer as well as plugin scripts
        window.UIengine.iframeScripts.forEach(src => this.addScriptToIframe(src, iframe))

        // initialize iframe sizer
        if (!iframe.iFrameResizer) iframeResizer(iframeResizerOpts, iframe)

        // set initial iframe width and update it on resize
        this.iframeWidth = contentWindow.innerWidth
        contentWindow.onresize = this.iframeResizeHandler.bind(this)

        // notify
        this.$emit('iframe:load', iframe)
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
