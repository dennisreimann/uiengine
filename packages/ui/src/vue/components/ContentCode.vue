<template>
  <div class="code">
    <div
      v-if="raw"
      class="code__segment"
    >
      <button
        :title="'navigation.toggle' | localize"
        :aria-expanded="isExpanded('raw') | bool2string"
        data-test-variant-code-button="raw"
        class="code__header"
        type="button"
        @click.prevent="toggleExpanded('raw')"
      >
        <h4 class="code__title">
          {{ 'code.raw' | localize }}
        </h4>
        <AppIcon
          symbol="caret-down"
          class="code__expandicon"
        />
      </button>
      <div
        :hidden="!isExpanded('raw')"
        data-test-variant-code-part="raw"
      >
        <button
          class="code__copy"
          type="button"
          :aria-label="'options.copy_code' | localize"
          :data-tooltip-text="'options.copy_code_tooltip' | localize"
          data-clipboard-copy-code
          @click.prevent="copyRawToClipboard()"
        >
          <AppIcon
            symbol="clipboard-copy"
            class="code__copy-icon"
          />
        </button>
      </div>
      <div
        v-html="renderedRaw"
      />
    </div>

    <div
      v-if="context"
      class="code__segment"
    >
      <button
        :title="'navigation.toggle' | localize"
        :aria-expanded="isExpanded('context') | bool2string"
        data-test-variant-code-button="context"
        class="code__header"
        type="button"
        @click.prevent="toggleExpanded('context')"
      >
        <h4 class="code__title">
          {{ 'code.context' | localize }}
        </h4>
        <AppIcon
          symbol="caret-down"
          class="code__expandicon"
        />
      </button>
      <div
        :hidden="!isExpanded('context')"
        data-test-variant-code-part="context"
      >
        <button
          class="code__copy"
          type="button"
          :aria-label="'options.copy_code' | localize"
          :data-tooltip-text="'options.copy_code_tooltip' | localize"
          data-clipboard-copy-code
          @click.prevent="copyContextToClipboard()"
        >
          <AppIcon
            symbol="clipboard-copy"
            class="code__copy-icon"
          />
        </button>
        <div
          v-html="renderedContext"
        />
      </div>
    </div>

    <div
      v-if="!displayAllThemes"
      class="code__segment"
    >
      <button
        :title="'navigation.toggle' | localize"
        :aria-expanded="isExpanded('HTML') | bool2string"
        data-test-variant-code-button="HTML"
        class="code__header"
        type="button"
        @click.prevent="toggleExpanded('HTML')"
      >
        <h4 class="code__title">
          HTML
        </h4>
        <AppIcon
          symbol="caret-down"
          class="code__expandicon"
        />
      </button>
      <div
        :hidden="!isExpanded('HTML')"
        :data-test-variant-code-part="'HTML'"
      >
        <button
          class="code__copy"
          type="button"
          :aria-label="'options.copy_code' | localize"
          :data-tooltip-text="'options.copy_code_tooltip' | localize"
          data-clipboard-copy-code
          @click.prevent="copyHtmlToClipboard(renderedHTML)"
        >
          <AppIcon
            symbol="clipboard-copy"
            class="code__copy-icon"
          />
        </button>
        <div
          v-if="renderedHTML.content"
          v-html="renderPart(renderedHTML)"
        />
        <div v-else>
          <pre>{{ 'options.loading' | localize }}</pre>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { decorateCode, decorateContext, omit, isolateCode } from '../../shared/code'
import Iframe from '../mixins/iframe'
import Themes from '../mixins/themes'
import Clipboard from 'clipboard'

export default {
  mixins: [
    Iframe,
    Themes
  ],

  props: {
    extension: {
      type: String,
      default: null
    },

    raw: {
      type: String,
      default: null
    },

    context: {
      type: Object,
      default: null
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
      expanded: {
        raw: true,
        context: true
      },
      renderedHTML: {
        content: '',
        lang: 'text'
      }
    }
  },

  computed: {
    renderedRaw () {
      const raw = omit('code', this.raw)

      return decorateCode(raw)
    },

    renderedContext () {
      return decorateContext(this.context)
    },

    iframeSrc () {
      const themeId = this.currentTheme.id
      return `${window.UIengine.base}${this.pathPrefix}/${themeId}/${this.pathPostfix}.html`
    }
  },

  watch: {
    async expanded (oldValue, newValue) {
      if (!this.renderedHTML.content && newValue.HTML) {
        const response = await fetch(`${window.location.origin}${this.iframeSrc}`)

        this.renderedHTML = {
          content: response.ok ? await response.text() : `Error accessing ${window.location.origin}${this.iframeSrc} (${response.status})`,
          lang: 'html'
        }
      }
    }
  },

  methods: {
    renderPart ({ content, lang }) {
      const code = isolateCode('preview', content)
      const cleanCode = omit('code', code).trim()

      return decorateCode(cleanCode, lang)
    },

    isExpanded (key) {
      return !!this.expanded[key]
    },

    toggleExpanded (key) {
      this.$set(this.expanded, key, !this.expanded[key])
    },

    copyRawToClipboard () {
      const raw = omit('code', this.raw)
      this.copyCodeToClipboard(raw)
    },

    copyContextToClipboard () {
      const context = JSON.stringify(this.context, null, '  ')
      this.copyCodeToClipboard(context)
    },

    copyHtmlToClipboard ({ content }) {
      const code = isolateCode('preview', content)
      const cleanCode = omit('code', code).trim()

      this.copyCodeToClipboard(cleanCode)
    },

    copyCodeToClipboard (text) {
      const showTooltip = (e) => e.trigger.classList.add('copied')
      const clearTooltip = (e) => e.trigger.classList.remove('copied')

      return new Clipboard('[data-clipboard-copy-code]', {
        text: () => text
      })
        .on('success', event => {
          showTooltip(event)
          setTimeout(() => {
            clearTooltip(event)
          }, 2000)
        })
        .on('error', event => {
          console.error('[UIengine]', 'Clipboard error:', event)
        })
    }
  }
}
</script>

<style lang="stylus" scoped>
.code
  &__segment
    border 1px solid var(--uie-color-preview-border)
    border-radius var(--uie-base-border-radius)
    overflow hidden
    &:not(:last-child)
      margin-bottom var(--uie-space-l)
    .code__expandicon
      icon-size(24px)
    .code__header
      color var(--uie-color-code-header-text)
      background-color var(--uie-color-code-header-bg)
      &:not([aria-expanded="true"]):focus,
      &:not([aria-expanded="true"]):hover,
      &:not([aria-expanded="true"]):active
        color var(--uie-color-code-header-text-hover)
        background-color var(--uie-color-code-header-bg-hover)
      &[aria-expanded="false"]
        color var(--uie-color-code-header-text-current)
        background-color var(--uie-color-code-header-bg-current)
        .code__expandicon
          transform rotate(-90deg)

  &__header
    display flex
    width 100%
    background transparent
    align-items center
    justify-content space-between
    padding var(--uie-space-s) var(--uie-space-m)
    cursor pointer
    color var(--uie-color-code-header-text)

    &:focus
      outline none

    &[aria-expanded="true"] + div
      position relative
      border-top 1px solid var(--uie-color-preview-border)

      .code__copy
        position absolute
        top var(--uie-space-s)
        right var(--uie-space-s)

  &__title
    font-family var(--uie-font-family-regular)
    font-weight var(--uie-font-weight-regular)

  &__segment + &__segment &__header
    border-top 0

  &__expandicon
    transition-property transform
    transition-duration var(--uie-transition-duration-fast)
    icon-size(24px)
    fill var(--uie-color-code-header-text)

  &__copy
    display inline-flex
    padding var(--uie-space-s)
    border 1px solid var(--uie-color-preview-border)
    border-radius var(--uie-base-border-radius)
    background-color var(--uie-color-code-header-bg)
    cursor pointer
    &:hover
      background-color var(--uie-color-neutral-10)

    &.copied
      &::before
        position absolute
        top 50%
        right calc(100% + var(--uie-space-s))
        transform translateY(-50%)
        content attr(data-tooltip-text)
        padding var(--uie-space-xs) var(--uie-space-s)
        border 1px solid var(--uie-color-preview-border)
        border-radius var(--uie-base-border-radius)
        background-color var(--uie-color-neutral-100)
        color var(--uie-color-neutral-0)
        font-size var(--uie-font-size-xs)

    &-icon
      icon-size(16px)
      fill var(--uie-color-code-header-text)
      pointer-events none
</style>
