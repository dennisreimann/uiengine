<template>
  <div class="code">
    <div
      v-if="raw"
      class="code__segment"
    >
      <button
        :title="'navigation.toggle' | localize"
        :aria-expanded="isExpanded('raw') | bool2string"
        class="code__header"
        type="button"
        @click.prevent="toggleExpanded('raw')"
      >
        <h4 class="code__title">
          {{ 'code.raw' | localize }}
        </h4>
        <AppIcon
          symbol="caret-down-double"
          class="code__expandicon"
        />
      </button>
      <div
        :hidden="!isExpanded('raw')"
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
        class="code__header"
        type="button"
        @click.prevent="toggleExpanded('context')"
      >
        <h4 class="code__title">
          {{ 'code.context' | localize }}
        </h4>
        <AppIcon
          symbol="caret-down-double"
          class="code__expandicon"
        />
      </button>
      <div
        :hidden="!isExpanded('context')"
        v-html="renderedContext"
      />
    </div>

    <div
      v-for="part in codeParts"
      :key="part.title"
      class="code__segment"
    >
      <button
        :title="'navigation.toggle' | localize"
        :aria-expanded="isExpanded(part.title) | bool2string"
        class="code__header"
        type="button"
        @click.prevent="toggleExpanded(part.title)"
      >
        <h4 class="code__title">
          {{ part.title }}
        </h4>
        <AppIcon
          symbol="caret-down-double"
          class="code__expandicon"
        />
      </button>
      <div
        :hidden="!isExpanded(part.title)"
        v-html="renderPart(part)"
      />
    </div>
  </div>
</template>

<script>
import { decorateContext, decorateCode } from '../../util'

const regexpClean = new RegExp('([\\s]*?<!--\\s?omit:.*?\\s?-->)', 'gi')

const omit = (mark, string) => {
  const regexpOmit = new RegExp(`([\\s]*?<!--\\s?omit:${mark}:start\\s?-->[\\s\\S]*?<!--\\s?omit:${mark}:end\\s?-->)`, 'gi')
  return string.replace(regexpOmit, '').replace(regexpClean, '')
}

export default {
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

    parts: {
      type: Array,
      default: null
    }
  },

  data () {
    return {
      expanded: {
        raw: true,
        context: true
      }
    }
  },

  computed: {
    codeParts () {
      return this.parts
        ? this.parts.filter(part => part.title && part.content)
        : []
    },

    renderedRaw () {
      const raw = omit('code', this.raw)

      return decorateCode(raw)
    },

    renderedContext () {
      return decorateContext(this.context)
    }
  },

  methods: {
    renderPart ({ content, lang }) {
      const code = omit('preview', content).trim()

      return decorateCode(code, lang)
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
    .code__expandicon
      fill var(--uie-color-code-header)
    .code__header
      color var(--uie-color-code-header)
      &:focus,
      &:hover,
      &:active
        color var(--uie-color-code-header-hover)
        .code__expandicon
          fill var(--uie-color-code-header-hover)
      &[aria-expanded="true"]
        color var(--uie-color-code-header-current)
        .code__expandicon
          fill var(--uie-color-code-header-current)
          transform rotate(-180deg)

  &__header
    display flex
    width 100%
    background transparent
    align-items center
    justify-content space-between
    border 1px solid var(--uie-color-border-medium)
    padding var(--uie-space-s) var(--uie-space-m)
    cursor pointer
    color var(--uie-color-code-header)

  &__segment + &__segment &__header
    border-top 0

  &__expandicon
    transition-property transform
    transition-duration var(--uie-transition-duration-fast)
    icon-size(24px)
</style>
