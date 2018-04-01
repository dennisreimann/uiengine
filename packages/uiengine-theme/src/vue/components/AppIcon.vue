<template>
  <svg
    class="icon"
    role="presentation"
    aria-hidden="true"
    focusable="false"
    :title="symbol"
  >
    <use :href="symbolHref" />
  </svg>
</template>

<script>
export default {
  props: {
    symbol: {
      type: String,
      required: true
    }
  },

  computed: {
    symbolHref () {
      return `#${this.symbol}`
    }
  }
}
</script>

<style lang="stylus" scoped>
.icon
  display inline-block
</style>
