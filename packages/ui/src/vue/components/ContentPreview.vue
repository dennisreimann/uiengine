<template>
  <div class="preview">
    <div class="preview__viewports sih--main soh--main-escape">
      <template v-if="isModeViewports">
        <div
          v-for="({ width, height }, name) in viewports"
          :key="name"
          :style="viewportStyle"
          :class="viewportClass"
          class="preview__viewport"
        >
          <div class="preview__title">
            {{ previewTitle(name, width) }}
          </div>
          <div
            :class="iframeContainerClass"
            class="preview__iframe-container"
          >
            <iframe
              ref="iframes"
              :src="path"
              :title="title"
              :style="{ width: `${iframeSize(width)}px` }"
              :width="iframeSize(width)"
              :height="iframeSize(height)"
              :scrolling="height ? 'yes' : 'no'"
              class="preview__iframe"
              frameborder="0"
            />
          </div>
        </div>
      </template>
      <template v-else>
        <div
          ref="viewport"
          :style="viewportStyle"
          :class="viewportClass"
          class="preview__viewport"
        >
          <template v-if="breakpoints">
            <div class="preview__title">
              <button
                :title="'options.toggle' | localize"
                class="preview__toggle"
                type="button"
                @click.stop="isBreakpointsActive = !isBreakpointsActive"
              >{{ size }}</button>
            </div>
            <div
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
                >{{ previewTitle(breakpoint, width) }}</button>
                <button
                  class="preview__option"
                  type="button"
                  @click="setWidth(null)"
                >{{ 'options.reset' | localize }}</button>
              </div>
            </div>
          </template>
          <div
            :class="iframeContainerClass"
            class="preview__iframe-container"
          >
            <iframe
              ref="iframes"
              :src="path"
              :title="title"
              class="preview__iframe"
              frameborder="0"
              scrolling="no"
            />
          </div>
        </div>
      </template>
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

    type: {
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
    },

    viewports: {
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
    ...mapGetters('preferences', ['previewWidths', 'previewMode']),

    isModeViewports () {
      return this.type !== 'tokens' && this.previewMode === 'viewports'
    },

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
        return this.previewTitle(name, this.iframeWidth)
      } else {
        return `${this.iframeWidth}px`
      }
    },

    viewportClass () {
      return `preview__viewport--${this.previewMode} preview__viewport--${this.type}`
    },

    viewportStyle () {
      if (this.previewMode === 'viewports') return {}

      const width = this.previewWidths[this.id]

      return width ? { 'width': `calc(${width}px + var(--uie-preview-border-width) * 2)` } : {}
    },

    iframeContainerClass () {
      return `preview__iframe-container--${this.type}`
    },

    iframes () {
      let { iframes } = this.$refs
      // convert single brakpoints iframe into array
      if (iframes instanceof HTMLElement) iframes = [iframes]

      return iframes
    }
  },

  created () {
    this.$root.$on('modal:close', () => {
      this.isBreakpointsActive = false
    })
  },

  mounted () {
    // setup iframes on their initial load
    this.iframes.forEach(iframe => {
      iframe.addEventListener('load', this.setupIframe.bind(this))
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
        this.$refs.viewport.style.width = null
      }

      this.setPreviewWidths(widths)
    },

    iframeSize (value) {
      const int = parseInt(value)

      return isNaN(int) ? null : int
    },

    previewTitle (name, width) {
      return `${name} @ ${width}px`
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
    },

    handleCustomAction (action) {
      let { type, elem, className } = action
      elem = elem || 'body'

      if (type === 'TOGGLE_CLASS') {
        if (!className) {
          return console.error('Please specify a className to toggle.')
        }
        this.iframes.forEach(iframe => {
          const el = iframe.contentDocument.querySelector(elem)
          if (el) {
            el.classList.toggle(className)
          } else {
            console.warn(`Element with selector "${el}" could not be found in preview.`)
          }
        })
      } else {
        console.error(`Custom action of type "${type}" does not exist.`)
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
.preview
  position relative

  &__viewports
    overflow auto
    white-space nowrap

  &__viewport
    vertical-align top

    &--breakpoints,
    &--viewports
      display inline-block
      overflow auto
      &:last-child
        @media $mq-up_to_m
          margin-right var(--uie-space-m)
        @media $mq-m_to_l
          margin-right var(--uie-space-l)
        @media $mq-l_to_xl
          margin-right var(--uie-space-xl)
        @media $mq-xl_to_xxl
          margin-right var(--uie-space-xxl)
        @media $mq-xxl_and_up
          margin-right var(--uie-space-xxxl)

    &--viewports + &--viewports
      margin-left var(--uie-space-xxl)

    &--breakpoints
      resize horizontal
      width 100%

    &--tokens
      display block
      resize none

  &__title
    padding-bottom var(--uie-space-s)

  &__toggle
    color var(--uie-color-modal-text)
    background var(--uie-color-main-bg)
    display inline-block
    font-size var(--uie-font-size-s)
    font-family var(--uie-font-family-light)
    cursor pointer

  &__options
    position absolute
    z-index 5
    left calc(var(--uie-space-m) * -1)
    max-height 0
    transition-duration var(--uie-transition-duration-medium)
    transition-property max-height
    transition-timing-function ease-out
    overflow hidden

    &--active
      max-height 20rem
      transition-timing-function ease-in

  &__options-inner
    border 1px solid var(--uie-color-modal-border-outer)

  &__option
    modal-option()

  &__option + &__option
    border-top 1px solid var(--uie-color-modal-border-inner)

  &__iframe-container
    &--variant,
    &--template
      box-sizing content-box
      border var(--uie-preview-border-width) solid var(--uie-color-border-preview)
      border-radius var(--uie-preview-border-width)

  &__iframe
    display block
    width 100%
</style>
