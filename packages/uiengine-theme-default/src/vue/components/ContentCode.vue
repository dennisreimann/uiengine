<template>
  <div class="code">
    <div
      v-if="raw"
      class="code__segment"
      :class="{ 'code__segment--expanded': isRawExpanded }"
    >
      <button
        class="code__header"
        type="button"
        :title="'navigation.toggle' | localize"
        @click.prevent="isRawExpanded = !isRawExpanded"
      >
        <h4 class="code__title">{{ 'code.raw' | localize }}</h4>
        <app-icon
          symbol="caret-down-double"
          class="code__expandicon"
        />
      </button>
      <div
        class="code__content"
        v-html="renderedRaw"
      />
    </div>

    <div
      v-if="context"
      class="code__segment"
      :class="{ 'code__segment--expanded': isContextExpanded }"
    >
      <button
        class="code__header"
        type="button"
        :title="'navigation.toggle' | localize"
        @click.prevent="isContextExpanded = !isContextExpanded"
      >
        <h4 class="code__title">{{ 'code.context' | localize }}</h4>
        <app-icon
          symbol="caret-down-double"
          class="code__expandicon"
        />
      </button>
      <div
        class="code__content"
        v-html="renderedContext"
      />
    </div>

    <div
      v-if="rendered"
      class="code__segment"
      :class="{ 'code__segment--expanded': isRenderedExpanded }"
    >
      <button
        class="code__header"
        type="button"
        :title="'navigation.toggle' | localize"
        @click.prevent="isRenderedExpanded = !isRenderedExpanded"
      >
        <h4 class="code__title">{{ 'code.rendered' | localize }}</h4>
        <app-icon
          symbol="caret-down-double"
          class="code__expandicon"
        />
      </button>
      <div
        class="code__content"
        v-html="renderedRendered"
      />
    </div>
  </div>
</template>

<script>
import { decorateRaw, decorateContext, decorateRendered } from '../../util'

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

    rendered: {
      type: String,
      default: null
    }
  },

  data () {
    return {
      isRawExpanded: true,
      isContextExpanded: true,
      isRenderedExpanded: false
    }
  },

  computed: {
    renderedRaw () {
      return decorateRaw(this.raw)
    },

    renderedContext () {
      return decorateContext(this.context)
    },

    renderedRendered () {
      return decorateRendered(this.rendered)
    }
  }
}
</script>

<style lang="stylus" scoped>
.code
  &__segment
    .code__expandicon
      fill var(--color-code-header)
    .code__header
      color var(--color-code-header)
      &:focus,
      &:hover,
      &:active
        color var(--color-code-header-hover)
        .code__expandicon
          fill var(--color-code-header-hover)

    &--expanded
      .code__header
        color var(--color-code-header-current)
      .code__expandicon
        fill var(--color-code-header-current)
        transform rotate(-180deg)

  &__segment:not(&--expanded) + &__segment &__header
    border-top 0

  &__header
    display flex
    width 100%
    background transparent
    align-items center
    justify-content space-between
    border 1px solid var(--color-border-medium)
    padding var(--space-s) var(--space-m)
    cursor pointer
    color var(--color-code-header)

  &__expandicon
    transition-property transform
    transition-duration var(--transition-duration-fast)
    icon-size(1)

  &__content
    display none
    .code__segment--expanded &
      display block
</style>
