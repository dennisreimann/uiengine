<template>
  <div class="molecule">
    <Atom />
  </div>
</template>

<script>
import Atom from '../../elements/Atom'

export default {
  name: 'Molecule',

  components: {
    Atom
  }
}
</script>
