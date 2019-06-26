<template>
  <p>Props as an object with types.</p>
</template>

<script>
export default {
  name: 'TypedProps',

  props: {
    id: Number, // eslint-disable-line vue/require-default-prop
    title: String // eslint-disable-line vue/require-default-prop
  }
}
</script>
