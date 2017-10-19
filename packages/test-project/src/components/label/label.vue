<template>
  <label class="label" :for="for">
    {{ title }}
  </label>
</template>

<script>
export default {
  name: 'my-label',
  props: ['for', 'title']
}
</script>
