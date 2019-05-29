<template>
  <div class="organism">
    <Atom />
    <Molecule>molecule</Molecule>
  </div>
</template>

<script>
import Atom from '../../elements/Atom'
import Molecule from '../Molecule'

export default {
  name: 'Organism',

  components: {
    Atom,
    Molecule
  }
}
</script>
