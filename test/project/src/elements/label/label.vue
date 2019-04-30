<template>
  <label
    :id="id"
    class="label"
  >
    {{ title }}
  </label>
</template>

<script>
export default {
  name: 'MyLabel',

  props: {
    id: {
      type: String,
      required: true
    },

    title: {
      type: String,
      required: true
    }
  }
}
</script>
