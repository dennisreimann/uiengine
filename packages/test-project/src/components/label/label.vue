<template>
  <label
    class="label"
    :id="id"
  >
    {{ title }}
  </label>
</template>

<script>
import props from './props'

export default {
  name: 'MyLabel',

  props
}
</script>
