<template>
  <div class="code">
    <div v-if="raw" @click.prevent="isRawExpanded = !isRawExpanded" :class="{ 'code__segment--expanded': isRawExpanded }" class="code__segment">
      <header class="code__header" role="button">
        <h4 class="code__title">{{ 'code.raw' | localize }}</h4>
        <app-icon symbol="caret-down-double" class="code__expandicon" />
      </header>
      <div class="code__content" v-html="renderedRaw" />
    </div>

    <div v-if="context" @click.prevent="isContextExpanded = !isContextExpanded" :class="{ 'code__segment--expanded': isContextExpanded }" class="code__segment">
      <header class="code__header" role="button">
        <h4 class="code__title">{{ 'code.context' | localize }}</h4>
        <app-icon symbol="caret-down-double" class="code__expandicon" />
      </header>
      <div class="code__content" v-html="renderedContext" />
    </div>

    <div v-if="rendered" @click.prevent="isRenderedExpanded = !isRenderedExpanded" :class="{ 'code__segment--expanded': isRenderedExpanded }" class="code__segment">
      <header class="code__header" role="button">
        <h4 class="code__title">{{ 'code.rendered' | localize }}</h4>
        <app-icon symbol="caret-down-double" class="code__expandicon" />
      </header>
      <div class="code__content" v-html="renderedRendered" />
    </div>
  </div>
</template>

<script>
import { decorateRaw, decorateContext, decorateRendered } from '../../util'

export default {
  props: {
    extension: {
      type: String
    },

    raw: {
      type: String
    },

    context: {
      type: Object
    },

    rendered: {
      type: String
    }
  },

  data () {
    return {
      isRawExpanded: true,
      isContextExpanded: true,
      isRenderedExpanded: false
    }
  },

  computed: {
    renderedRaw () {
      return decorateRaw(this.raw)
    },

    renderedContext () {
      return decorateContext(this.context)
    },

    renderedRendered () {
      return decorateRendered(this.rendered)
    }
  }
}
</script>
