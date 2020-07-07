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
        v-html="renderedContext"
      />
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
    }
  }
}
</script>

<style lang="stylus" scoped>
.code
  &__segment
    border 1px solid var(--uie-color-border-preview)
    border-radius var(--uie-base-border-radius)
    overflow hidden
    &:not(:last-child)
      margin-bottom var(--uie-space-l)
    .code__expandicon
      icon-size(24px)
    .code__header
      color var(--uie-color-code-header)
      &:focus,
      &:hover,
      &:active
        color var(--uie-color-code-header-hover)
      &[aria-expanded="true"]
        color var(--uie-color-code-header-current)
        background-color var(--uie-color-code-header-bg)
        .code__expandicon
          transform rotate(-180deg)

  &__header
    display flex
    width 100%
    background transparent
    align-items center
    justify-content space-between
    padding var(--uie-space-s) var(--uie-space-m)
    cursor pointer
    color var(--uie-color-code-header)

    &:focus
      outline none

    &[aria-expanded="true"] + div
      border-top 1px solid var(--uie-color-border-preview)

  &__title
    font-weight var(--uie-font-weight-bold)

  &__segment + &__segment &__header
    border-top 0

  &__expandicon
    transition-property transform
    transition-duration var(--uie-transition-duration-fast)
    icon-size(24px)
    fill var(--uie-color-code-header)
</style>
