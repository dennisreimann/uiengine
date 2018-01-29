<template>
  <div class="preview">
    <div
      class="preview__container"
      :style="containerStyle"
    >
      <div
        v-if="breakpoints"
        class="preview__size"
      >
        <button
          class="preview__sizer"
          type="button"
          @click.stop="isBreakpointsActive = !isBreakpointsActive"
        >{{ size }}</button>
      </div>
      <div
        v-if="breakpoints"
        class="preview__breakpoints"
        :class="{ 'preview__breakpoints--active': isBreakpointsActive }"
      >
        <div class="preview__breakpoints-inner">
          <button
            v-for="(width, breakpoint) in breakpoints"
            :key="breakpoint"
            class="preview__breakpoint"
            type="button"
            @click="setPreviewWidth(width)"
          >{{ breakpoint }}: {{ width }}px</button>
          <button
            class="preview__breakpoint"
            type="button"
            @click="setPreviewWidth(null)"
          >{{ 'breakpoints.reset' | localize }}</button>
        </div>
      </div>
      <iframe
        ref="iframe"
        :src="src"
        class="preview__iframe"
        frameborder="0"
        scrolling="no"
      />
    </div>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
import { iframeResizer } from 'iframe-resizer'

// iframe resizing, see https://github.com/davidjbradshaw/iframe-resizer
const iframeResizerOpts = { resizeFrom: 'child' }

export default {
  props: {
    id: {
      type: String,
      required: true
    },

    src: {
      type: String,
      required: true
    },

    breakpoints: {
      type: Object,
      default: null
    }
  },

  data () {
    return {
      isBreakpointsActive: false,
      iframeWidth: null
    }
  },

  computed: {
    ...mapGetters('preferences', ['previewWidths']),

    breakpointNames () {
      return Object.keys(this.breakpoints)
    },

    breakpointWidths () {
      return Object.values
        ? Object.values(this.breakpoints)
        : Object.keys(this.breakpoints).map(k => this.breakpoints[k])
    },

    size () {
      if (!this.iframeWidth) {
        return ''
      } else if (this.breakpoints) {
        const bps = this.breakpointWidths.filter(width => width <= this.iframeWidth)
        const name = bps.length ? this.breakpointNames[bps.length - 1] : `< ${this.breakpointNames[0]}`
        return `${name} @ ${this.iframeWidth}px`
      } else {
        return `${this.iframeWidth}px`
      }
    },

    containerStyle () {
      const width = this.previewWidths[this.id]

      return width ? { width: `${width}px` } : {}
    }
  },

  created () {
    this.$root.$on('modal:close', () => {
      this.isBreakpointsActive = false
    })
  },

  mounted () {
    const { iframe } = this.$refs
    const setupIframe = () => {
      const { contentDocument, contentWindow } = iframe
      const head = contentDocument.getElementsByTagName('head')[0]

      // dynamically add scripts (manifest and iframe sizer)
      const addScript = src => {
        if (!src) return
        const script = document.createElement('script')
        script.src = src
        head.appendChild(script)
      }

      addScript(window.UIengine.manifestSrc)
      addScript(window.UIengine.previewSrc)

      iframeResizer(iframeResizerOpts, iframe)

      // set initial iframe width and update it on resize
      this.iframeWidth = contentWindow.innerWidth
      contentWindow.onresize = event => {
        const { innerWidth } = event.target
        this.iframeWidth = innerWidth
      }
    }

    // setup on initial load
    iframe.addEventListener('load', setupIframe.bind(this), { once: true })

    // reload on file change
    this.$root.$on('file:change', filePath => {
      if (filePath === this.src && iframe.contentWindow) {
        iframe.contentWindow.location.reload()
      }
    })
  },

  methods: {
    ...mapMutations('preferences', ['setPreviewWidths']),

    setPreviewWidth (width) {
      const previewWidths = this.previewWidths

      if (width) {
        previewWidths[this.id] = width
      } else {
        delete previewWidths[this.id]
      }

      this.setPreviewWidths(previewWidths)
    }
  }
}
</script>
