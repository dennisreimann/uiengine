<template>
  <dl class="colorToken">
    <div class="colorToken__info colorToken__info--top sob-m">
      <div class="colorToken__symbol">
        <div class="colorToken__swatch">
          <div
            class="colorToken__swatch__inner"
            :style="swatchStyle"
          />
        </div>
      </div>
      <div class="colorToken__title">{{ token.name }}</div>
    </div>
    <div
      v-if="token.description"
      class="colorToken__info"
    >
      <dt class="colorToken__label">{{ 'token.description' | localize }}</dt>
      <dd class="colorToken__value">{{ token.description }}</dd>
    </div>
    <div
      v-if="token.variable"
      class="colorToken__info"
    >
      <dt class="colorToken__label">{{ 'token.variable' | localize }}</dt>
      <dd class="colorToken__value colorToken__value--code">{{ token.variable }}</dd>
    </div>
    <!-- if this color references another color only display the reference, otherwise the values -->
    <div
      v-if="token.reference"
      class="colorToken__info"
    >
      <dt class="colorToken__label">{{ 'token.reference' | localize }}</dt>
      <dd class="colorToken__value">{{ token.reference }}</dd>
    </div>
    <template v-elseif="token.value">
      <div class="colorToken__info">
        <dt class="colorToken__label">HEX</dt>
        <dd class="colorToken__value colorToken__value--code">{{ hex }}</dd>
      </div>
      <div class="colorToken__info">
        <dt class="colorToken__label">RGB</dt>
        <dd class="colorToken__value colorToken__value--code">{{ rgb }}</dd>
      </div>
      <div class="colorToken__info">
        <dt class="colorToken__label">HSL</dt>
        <dd class="colorToken__value colorToken__value--code">{{ hsl }}</dd>
      </div>
    </template>
  </dl>
</template>

<script>
import Color from 'color'

export default {
  props: {
    token: {
      type: Object,
      required: true
    }
  },

  computed: {
    swatchStyle () {
      return { backgroundColor: this.rgb }
    },

    color () {
      return Color(this.token.value)
    },

    hex () {
      return this.color.hex().toString()
    },

    rgb () {
      return this.color.rgb().toString()
    },

    hsl () {
      return this.color.hsl().toString()
    }
  }
}
</script>

<style lang="stylus" scoped>
.colorToken
  flex 0 0 22.5rem
  margin-bottom var(--space-xl)
  padding-right var(--space-xxl)

  &__swatch
    display inline-block
    width 4.5rem
    height 4.5rem
    border-radius 50%
    border-bottom-right-radius 0
    border 1px solid var(--color-secondary-text)
    padding 2px

    &__inner
      width 100%
      height 100%
      border-radius 50%
      border-bottom-right-radius 0

  &__info
    display flex

    &--top
      align-items flex-end

  &__info + &__info
    margin-top var(--space-xs)

  &__label,
  &__symbol
    flex 0 0 5.75rem
    padding-right var(--space-m)
    text-align right

  &__title
    flex 1
    font-family var(--font-family-regular)

  &__label
    padding-top calc(var(--font-size-s) - var(--font-size-xs))
    color var(--color-secondary-text)
    font-family var(--font-family-light)
    font-size var(--font-size-xs)

  &__value
    flex 1
    font-size var(--font-size-s)

    &--code
      font-family var(--font-family-code)
</style>
