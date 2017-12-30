<script>
export default {
  props: {
    level: {
      type: Number,
      default: 1
    }
  },

  render (createElement) {
    return createElement(
      `h${this.level}`,
      this.$slots.default
    )
  }
}
</script>
