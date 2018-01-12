<template>
  <svg
    class="icon"
    role="img"
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
