<template>
  <div class="preview">
    <div
      :style="containerStyle"
      class="preview__container"
    >
      <div
        v-if="breakpoints"
        class="preview__toggles"
      >
        <button
          :title="'options.toggle' | localize"
          class="preview__toggle"
          type="button"
          @click.stop="isBreakpointsActive = !isBreakpointsActive"
        >{{ size }}</button>
      </div>
      <div
        v-if="breakpoints"
        :class="{ 'preview__options--active': isBreakpointsActive }"
        class="preview__options"
      >
        <div class="preview__options-inner">
          <button
            v-for="(width, breakpoint) in breakpoints"
            :key="breakpoint"
            class="preview__option"
            type="button"
            @click="setWidth(width)"
          >{{ breakpoint }}: {{ width }}px</button>
          <button
            class="preview__option"
            type="button"
            @click="setWidth(null)"
          >{{ 'options.reset' | localize }}</button>
        </div>
      </div>

      <iframe
        ref="iframe"
        :src="src"
        :title="title"
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

    title: {
      type: String,
      required: true
    },

    path: {
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
    ...mapGetters('preferences', ['previewWidths', 'currentTheme']),

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
    },

    src () {
      const { protocol, host } = window.location
      const base = `${protocol}//${host}`
      const url = new URL(this.path, base)
      const theme = this.currentTheme

      if (theme) url.hash = theme.id

      return url
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
    iframe.addEventListener('load', setupIframe.bind(this))

    // reload on file change
    this.$root.$on('file:change', filePath => {
      if (filePath === this.path && iframe.contentWindow) {
        iframe.contentWindow.location.reload()
        console.debug('[UIengine]', 'Reload on file change', filePath)
      }
    })
  },

  methods: {
    ...mapMutations('preferences', ['setPreviewWidths']),

    setWidth (width) {
      const widths = this.previewWidths

      if (width) {
        widths[this.id] = width
      } else {
        delete widths[this.id]
      }

      this.setPreviewWidths(widths)
    }
  }
}
</script>

<style lang="stylus" scoped>
.preview
  position relative

  &__container
    min-width 250px
    resize horizontal
    overflow scroll
    margin 0 auto
    text-align center
    // leave space for the resize handle
    padding-bottom var(--space-m)

    &[data-breakpoint]
      transition-property width
      transition-duration var(--transition-duration-medium)
      transition-timing-function ease-out

  &__toggles
    position relative
    margin-bottom var(--space-s)

    &:before,
    &:after
      width 40px
      height 15px
      position absolute
      top calc(50% - 8px)
      content ''
      background-color var(--color-white)
      background-size 40px 15px
      background-repeat no-repeat

    &:before
      left 0
      background-image embedurl('../../icons/preview-left.svg')

    &:after
      right 0
      background-image embedurl('../../icons/preview-right.svg')

  &__toggle
    padding-left var(--space-m)
    padding-right var(--space-m)
    color var(--color-modal-text)
    background var(--color-main-bg)
    display inline-block
    font-size var(--font-size-s)
    font-family var(--font-family-light)
    cursor pointer

  &__options
    position absolute
    z-index 5
    left calc(50% - 5rem)
    width 10rem
    max-height 0
    transition-duration var(--transition-duration-medium)
    transition-property max-height
    transition-timing-function ease-out
    overflow hidden

    &--active
      max-height 20rem
      transition-timing-function ease-in

  &__options-inner
    border 1px solid var(--color-modal-border-outer)

  &__option
    modal-option()

  &__option + &__option
    border-top 1px solid var(--color-modal-border-inner)

  &__iframe
    display block
    width 100%
    border 0
</style>
