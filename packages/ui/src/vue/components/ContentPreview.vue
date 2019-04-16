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
            class="preview__iframe-container"
          >
            <iframe
              v-for="theme in displayedThemes"
              :key="theme.id"
              ref="iframes"
              :data-src="iframeSrc(theme.id)"
              :title="title"
              :style="{ width: `${iframeSize(width)}px` }"
              :width="iframeSize(width)"
              :height="iframeSize(height)"
              :scrolling="height ? 'yes' : 'no'"
              :data-test-viewport-iframe="`${theme.id}-${name}`"
              class="preview__iframe lazy"
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
              >
                {{ size }}
              </button>
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
                >
                  {{ previewTitle(breakpoint, width) }}
                </button>
                <button
                  class="preview__option"
                  type="button"
                  @click="setWidth(null)"
                >
                  {{ 'options.reset' | localize }}
                </button>
              </div>
            </div>
          </template>
          <div
            class="preview__iframe-container"
          >
            <iframe
              v-for="theme in displayedThemes"
              :key="theme.id"
              ref="iframes"
              src="about:"
              aria-roledescription="iframe"
              :data-src="iframeSrc(theme.id)"
              :title="title"
              :data-test-breakpoint-iframe="theme.id"
              class="preview__iframe lazy"
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
import Iframe from '../mixins/iframe'
import Preview from '../mixins/preview'

export default {
  mixins: [
    Iframe,
    Preview
  ],

  props: {
    id: {
      type: String,
      required: true
    },

    title: {
      type: String,
      required: true
    },

    pathPrefix: {
      type: String,
      required: true
    },

    pathPostfix: {
      type: String,
      required: true
    }
  },

  data () {
    return {
      isBreakpointsActive: false
    }
  },

  computed: {
    ...mapGetters('state', ['config']),
    ...mapGetters('preferences', ['previewWidths', 'previewMode']),

    breakpoints () {
      return this.config.ui.breakpoints
    },

    viewports () {
      return this.config.ui.viewports
    },

    isModeViewports () {
      return this.previewMode === 'viewports'
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
      return `preview__viewport--${this.previewMode}`
    },

    viewportStyle () {
      if (this.previewMode === 'viewports') return {}

      const width = this.previewWidths[this.id]

      return width ? { 'width': `calc(${width}px + var(--uie-preview-border-width) * 2)` } : {}
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

    this.$store.watch(() => this.$store.getters['preferences/currentTheme'], () => {
      // use requestAnimationFrame to wait for vue rendering and update the $refs.iframes
      window.requestAnimationFrame(() => {
        this.iframes.forEach(this.resizableIframe)
      })
    })
  },

  mounted () {
    this.iframes.forEach(this.resizableIframe)
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

    iframeSrc (themeId) {
      return `${window.UIengine.base}${this.pathPrefix}/${themeId}/${this.pathPostfix}.html`
    },

    previewTitle (name, width) {
      return `${name} @ ${width}px`
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

    &--viewports + &--viewports
      margin-left var(--uie-space-xxl)

    &--breakpoints
      resize horizontal
      width 100%

  &__title
    padding-bottom var(--uie-space-s)

  &__toggle
    color var(--uie-color-modal-text)
    background var(--uie-color-main-bg)
    display inline-block
    font-family var(--uie-font-family-light)
    font-size var(--uie-font-size-s)
    font-weight var(--uie-font-weight-light)
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
    box-sizing content-box
    border var(--uie-preview-border-width) solid var(--uie-color-border-preview)
    border-radius var(--uie-preview-border-width)

  &__iframe + &__iframe
    border-top var(--uie-preview-border-width) solid var(--uie-color-border-preview)

  &__iframe
    box-sizing content-box
    display block
    width 100%
</style>
