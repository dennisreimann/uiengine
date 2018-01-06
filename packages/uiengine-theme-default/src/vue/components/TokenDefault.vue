<template>
  <tr class="defaultToken">
    <td class="defaultToken__value">{{ token.name }}</td>
    <td class="defaultToken__value defaultToken__value--value">{{ token.value }}</td>
    <td class="defaultToken__value defaultToken__value--variable" v-if="columns.variable">{{ token.variable }}</td>
    <td class="defaultToken__value defaultToken__value--description" v-if="columns.description">{{ token.description }}</td>
    <td class="defaultToken__value defaultToken__value--reference" v-if="columns.reference">{{ token.reference }}</td>
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
