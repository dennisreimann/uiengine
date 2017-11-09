<template>
  <label class="label" :id="id">
    {{ title }}
  </label>
</template>

<script>
export default {
  name: 'MyLabel',
  props: {
    id: String,
    title: String
  }
}
</script>
