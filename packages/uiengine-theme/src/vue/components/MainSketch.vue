<template>
  <div>
    <section
      v-for="component in components"
      :key="component.id"
      class="component"
    >
      <content-header :title="component.title" />
      <article
        v-for="variant in component.variants"
        :key="variant.id"
      >
        <div
          v-html="variant.rendered"
          :data-sketch-symbol="symbolName(variant)"
        />
      </article>
    </section>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { dasherize } from '../../util'
import ContentHeader from './ContentHeader'
import ContentHeading from './ContentHeading'
import ContentProperties from './ContentProperties'
import ContentLabel from './ContentLabel'
import ContentTag from './ContentTag'
import ComponentVariant from './ComponentVariant'

export default {
  components: {
    ContentHeader,
    ContentHeading,
    ContentProperties,
    ContentLabel,
    ContentTag,
    ComponentVariant
  },

  computed: {
    ...mapGetters('state', ['components', 'variants'])
  },

  methods: {
    dasherize,

    symbolName (variant) {
      const component = this.components[variant.componentId]
      return `${component.title}/${variant.title}`
    }
  }
}
</script>
