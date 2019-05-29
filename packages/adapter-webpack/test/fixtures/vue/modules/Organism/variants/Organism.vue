<template>
  <div class="organism-variant">
    <Organism v-bind="$props" />
    <Molecule>molecule</Molecule>
  </div>
</template>

<script>
import Organism from '..'
import Molecule from '../../Molecule'

export default {
  components: {
    Molecule,
    Organism
  }
}
</script>
