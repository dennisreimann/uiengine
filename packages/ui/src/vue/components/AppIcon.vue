<template>
  <svg
    :title="title"
    class="icon"
    role="presentation"
    aria-hidden="true"
    focusable="false"
  >
    <use :xlink:href="symbolHref" />
  </svg>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: ''
    },

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
