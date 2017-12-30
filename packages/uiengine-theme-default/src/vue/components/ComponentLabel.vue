<template>
  <span class="label" :class="{ 'label--inverted': inverted }">
    <slot />
  </span>
</template>

<script>
export default {
  props: {
    inverted: {
      type: Boolean,
      default: false
    }
  }
}
</script>
