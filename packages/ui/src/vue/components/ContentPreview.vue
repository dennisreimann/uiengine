<template>
  <div class="preview">
    <template v-if="!isModeViewports">
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
            <span class="preview__option-label">{{ breakpoint }}</span>
            <span class="preview__option-width">{{ width }}px</span>
          </button>
          <button
            class="preview__option"
            type="button"
            @click="setWidth(null)"
          >
            <span class="preview__option-label">
              <AppIcon
                symbol="reset"
                class="preview__option-label-icon"
              />
            </span>
            {{ 'options.reset' | localize }}
          </button>
        </div>
      </div>
    </template>
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
            v-for="theme in displayedThemes"
            :key="theme.id"
            class="preview__iframe-container"
            :data-test-iframe-container="`${theme.id}-${name}`"
          >
            <div
              v-if="displayAllThemes"
              class="preview__theme-title"
            >
              {{ theme.title }}
            </div>
            <iframe
              ref="iframes"
              src="about:blank"
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
              {{ size }}
            </div>
          </template>
          <div
            v-for="theme in displayedThemes"
            :key="theme.id"
            class="preview__iframe-container"
            :data-test-iframe-container="theme.id"
          >
            <div
              v-if="displayAllThemes"
              class="preview__theme-title"
            >
              {{ theme.title }}
            </div>
            <iframe
              ref="iframes"
              src="about:blank"
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
import Themes from '../mixins/themes'

export default {
  mixins: [
    Iframe,
    Themes
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

      return width ? { width: `calc(${width}px + var(--uie-preview-padding) * 2 + 2px)` } : {}
    },

    iframes () {
      let { iframes } = this.$refs
      // convert single breakpoints iframe into array
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
    this.iframes.forEach(this.mountResizableIframe)

    this.$store.watch(() => this.$store.getters['preferences/currentTheme'], () => {
      // use requestAnimationFrame to wait for vue rendering and update the $refs.iframes
      window.requestAnimationFrame(() => {
        this.iframes.forEach(this.mountResizableIframe)
      })
    })
  },

  beforeDestroy () {
    this.iframes.forEach(this.unmountResizableIframe)
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
    },

    dispatchPluginEvent (type, plugin, payload) {
      const { id } = plugin

      this.iframes.forEach(iframe => {
        document.dispatchEvent(
          new CustomEvent(`${id}:${type}`, {
            detail: Object.assign(payload, { plugin, iframe })
          })
        )
      })
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
    margin-bottom var(--uie-space-l)

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
    display inline-block
    background-color var(--uie-color-border-preview)
    font-size var(--uie-font-size-xs)
    padding var(--uie-space-xs) var(--uie-space-s)
    border-radius var(--uie-base-border-radius) var(--uie-base-border-radius) 0 0
    color var(--uie-color-preview-title)

  &__toggle
    background-color transparent
    display inline-block
    font-family var(--uie-font-family-light)
    cursor pointer

  &__options
    margin-bottom var(--uie-space-l)
    overflow-x auto
    &-inner
      display flex
      justify-content center
      align-items center

  &__option
    padding var(--uie-space-s)
    font-size var(--uie-font-size-xs)
    color var(--uie-color-neutral-50)
    text-align center
    border-radius var(--uie-space-xs)
    background-color transparent
    &-label
      display block
      font-size var(--uie-font-size-s)
      margin-bottom var(--uie-space-xs)
      padding-bottom var(--uie-space-xs)
      min-width 36px
      border-bottom 1px solid var(--uie-color-neutral-30)
      color var(--uie-color-neutral-70)
      &-icon
        icon-size(12px)
        fill var(--uie-color-neutral-70)
    &:hover
      cursor pointer
      background-color var(--uie-color-neutral-20)
    &:focus
      outline none
    &:active
      .preview__option-label
        color var(--uie-color-neutral-90)

  &__iframe-container
    box-sizing content-box
    padding var(--uie-preview-padding)
    border 1px solid var(--uie-color-border-preview)
    border-radius var(--uie-base-border-radius)
    border-top-left-radius 0
    overflow hidden

  &__theme-title
    padding-bottom calc(var(--uie-preview-border-width) / 2)
    font-family var(--uie-font-family-light)
    font-size var(--uie-font-size-xs)

  &__iframe
    box-sizing content-box
    display block
    width 100%
</style>
