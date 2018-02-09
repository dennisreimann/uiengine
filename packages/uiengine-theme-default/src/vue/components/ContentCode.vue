<template>
  <div class="code">
    <div
      v-if="raw"
      class="code__segment"
      :class="{ 'code__segment--expanded': isRawExpanded }"
      @click.prevent="isRawExpanded = !isRawExpanded"
    >
      <header
        class="code__header"
        role="button"
      >
        <h4 class="code__title">{{ 'code.raw' | localize }}</h4>
        <app-icon
          symbol="caret-down-double"
          class="code__expandicon"
        />
      </header>
      <div
        class="code__content"
        v-html="renderedRaw"
      />
    </div>

    <div
      v-if="context"
      class="code__segment"
      :class="{ 'code__segment--expanded': isContextExpanded }"
      @click.prevent="isContextExpanded = !isContextExpanded"
    >
      <header
        class="code__header"
        role="button"
      >
        <h4 class="code__title">{{ 'code.context' | localize }}</h4>
        <app-icon
          symbol="caret-down-double"
          class="code__expandicon"
        />
      </header>
      <div
        class="code__content"
        v-html="renderedContext"
      />
    </div>

    <div
      v-if="rendered"
      class="code__segment"
      :class="{ 'code__segment--expanded': isRenderedExpanded }"
      @click.prevent="isRenderedExpanded = !isRenderedExpanded"
    >
      <header
        class="code__header"
        role="button"
      >
        <h4 class="code__title">{{ 'code.rendered' | localize }}</h4>
        <app-icon
          symbol="caret-down-double"
          class="code__expandicon"
        />
      </header>
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
      &:hover
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
