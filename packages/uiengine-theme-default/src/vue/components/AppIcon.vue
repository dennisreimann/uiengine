<template>
  <svg class="icon"  role="img">
    <use :href="symbolHref"></use>
  </svg>
</template>

<script>
import burgerIcon from '../../icons/sprite/burger.svg'
import caretDownIcon from '../../icons/sprite/caret-down.svg'
import caretDownDoubleIcon from '../../icons/sprite/caret-down-double.svg'
import linkIcon from '../../icons/sprite/link-45.svg'
import openInWindowIcon from '../../icons/sprite/open-in-window.svg'
import toolsIcon from '../../icons/sprite/tools.svg'

export default {
  props: {
    symbol: {
      type: String,
      required: true
    }
  },

  computed: {
    symbolHref () {
      return `#${this.symbol}`
    }
  }
}
</script>
