<template>
  <div>
    <section class="component">
      <content-header>
        <component-label inverted v-if="component.label" class="sob-m sor-s">{{ component.label }}</component-label>
        <content-heading class="contentheader__title">{{ component.title }}</content-heading>
        <div class="contentheader__options" v-if="hasInfo && hasSchema">
          <a href="#info" @click.prevent="activeSection = 'info'" class="contentheader__option" :class="{ 'contentheader__option--active': isInfoActive }">{{ 'component.info' | localize }}</a>
          <a href="#schema" @click.prevent="activeSection = 'schema'" class="contentheader__option" :class="{ 'contentheader__option--active': isSchemaActive }"> {{ 'component.schema' | localize }}</a>
        </div>
      </content-header>

      <div v-if="hasInfo || hasSchema" class="sot-xs">
        <div v-if="hasInfo" class="contentsection" :class="{ 'contentsection--active': isInfoActive }">
          <div class="content" v-if="component.content" v-html="component.content" />
          <div class="content sot-l fs-s" v-if="hasManyVariants">
            <ul>
              <li v-for="variantId in component.variantIds" :key="variantId">
                <router-link
                  :to="{ hash: dasherize(variants[variantId].id) }"
                  class=""
                  active-class=""
                  exact-active-class="">{{ variants[variantId].title }}</router-link>
              </li>
            </ul>
          </div>
        </div>

        <div v-if="hasSchema" class="contentsection" :class="{ 'contentsection--active': isSchemaActive }">
          <div class="content">
            <content-scheme v-for="(properties, schemeId) in component.schema"
              class="sob-xl"
              :key="schemeId"
              :schema="schema"
              :title="schemeId"
              :properties="properties" />
          </div>
        </div>
      </div>
    </section>

    <section v-if="hasVariants" class="variants">
      <component-variant v-for="variantId in component.variantIds" :key="variantId" :variant="variants[variantId]" />
    </section>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { dasherize } from '../../util'
import ContentHeader from './ContentHeader'
import ContentHeading from './ContentHeading'
import ContentScheme from './ContentScheme'
import ComponentLabel from './ComponentLabel'
import ComponentVariant from './ComponentVariant'

export default {
  props: {
    id: {
      type: String,
      required: true
    }
  },

  components: {
    ContentHeader,
    ContentHeading,
    ContentScheme,
    ComponentLabel,
    ComponentVariant
  },

  data () {
    return {
      activeSection: null
    }
  },

  computed: {
    ...mapGetters('state', ['components', 'schema', 'variants']),

    component () {
      return this.components[this.id]
    },

    hasVariants () {
      const { variantIds } = this.component
      return variantIds && variantIds.length > 0
    },

    hasManyVariants () {
      const { variantIds } = this.component
      return variantIds && variantIds.length > 1
    },

    hasSchema () {
      const { schema } = this.component
      return schema && Object.keys(schema).length > 0
    },

    hasInfo () {
      return !!(this.component.content || this.hasManyVariants)
    },

    isInfoActive () {
      return this.activeSection === 'info' || (!this.activeSection && this.hasInfo)
    },

    isSchemaActive () {
      return this.activeSection === 'schema' || (!this.activeSection && !this.hasInfo && this.hasSchema)
    }
  },

  methods: {
    dasherize
  }
}
</script>
