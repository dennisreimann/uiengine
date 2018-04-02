<template>
  <label
    :id="id"
    class="label"
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
