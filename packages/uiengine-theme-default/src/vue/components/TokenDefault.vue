<template>
  <tr class="defaultToken">
    <td class="defaultToken__value">{{ token.name }}</td>
    <td class="defaultToken__value defaultToken__value--value">{{ token.value }}</td>
    <td
      v-if="columns.variable"
      class="defaultToken__value defaultToken__value--variable"
    >{{ token.variable }}</td>
    <td
      v-if="columns.description"
      class="defaultToken__value defaultToken__value--description"
    >{{ token.description }}</td>
    <td
      v-if="columns.reference"
      class="defaultToken__value defaultToken__value--reference"
    >{{ token.reference }}</td>
  </tr>
</template>

<script>
export default {
  props: {
    token: {
      type: Object,
      required: true
    },

    columns: {
      type: Object,
      required: true
    }
  }
}
</script>

<style lang="stylus" scoped>
.defaultToken
  &__value
    &--value,
    &--variable
      font-family var(--font-family-code)
</style>

