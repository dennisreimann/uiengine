<template>
  <header class="contentheader">
    <content-heading class="contentheader__title" :level="level" v-if="title">{{title}}</content-heading>
    <slot />
  </header>
</template>

<script>
const ContentHeading = {
  props: {
    level: {
      type: Number,
      required: true
    }
  },

  render (createElement) {
    return createElement(
      `h${this.level}`,
      this.$slots.default
    )
  }
}

export default {
  components: {
    ContentHeading
  },

  props: {
    title: {
      type: String
    },

    level: {
      type: Number,
      default: 1
    }
  }
}
</script>
