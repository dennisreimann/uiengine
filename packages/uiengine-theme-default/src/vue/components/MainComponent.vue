<template>
  <div>
    <section class="component">
      <content-header>
        <component-label
          v-if="component.label"
          class="sob-m sor-s"
          inverted
        >{{ component.label }}</component-label>
        <content-heading class="contentheader__title">{{ component.title }}</content-heading>
        <div
          v-if="hasInfo && hasProperties"
          class="contentheader__options"
        >
          <a
            href="#info"
            class="contentheader__option"
            :class="{ 'contentheader__option--active': isInfoActive }"
            @click.prevent="activeSection = 'info'"
          >{{ 'component.info' | localize }}</a>
          <a
            href="#properties"
            class="contentheader__option"
            :class="{ 'contentheader__option--active': isPropertiesActive }"
            @click.prevent="activeSection = 'properties'"
          > {{ 'component.properties' | localize }}</a>
        </div>
      </content-header>

      <div
        v-if="hasInfo || hasProperties"
        class="sot-xs"
      >
        <div
          v-if="hasInfo"
          class="contentsection"
          :class="{ 'contentsection--active': isInfoActive }"
        >
          <div
            v-if="component.content"
            class="content"
            v-html="component.content"
          />
          <div
            v-if="hasManyVariants"
            class="content sot-l fs-s"
          >
            <ul>
              <li
                v-for="variantId in component.variantIds"
                :key="variantId"
              >
                <router-link
                  :to="{ hash: dasherize(variants[variantId].id) }"
                  class=""
                  active-class=""
                  exact-active-class=""
                >{{ variants[variantId].title }}</router-link>
              </li>
            </ul>
          </div>
        </div>

        <div
          v-if="hasProperties"
          class="contentsection"
          :class="{ 'contentsection--active': isPropertiesActive }"
        >
          <div class="content">
            <content-properties
              v-for="(properties, componentId) in component.properties"
              :key="componentId"
              :title="componentId"
              :entities="entities"
              :properties="properties"
              class="sob-xl"
            />
          </div>
        </div>
      </div>
    </section>

    <section
      v-if="hasVariants"
      class="variants"
    >
      <component-variant
        v-for="variantId in component.variantIds"
        :key="variantId"
        :variant="variants[variantId]"
      />
    </section>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { dasherize } from '../../util'
import ContentHeader from './ContentHeader'
import ContentHeading from './ContentHeading'
import ContentProperties from './ContentProperties'
import ComponentLabel from './ComponentLabel'
import ComponentVariant from './ComponentVariant'

export default {
  components: {
    ContentHeader,
    ContentHeading,
    ContentProperties,
    ComponentLabel,
    ComponentVariant
  },

  props: {
    id: {
      type: String,
      required: true
    }
  },

  data () {
    return {
      activeSection: null
    }
  },

  computed: {
    ...mapGetters('state', ['components', 'entities', 'variants']),

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

    hasProperties () {
      const { properties } = this.component
      return properties && Object.keys(properties).length > 0
    },

    hasInfo () {
      return !!(this.component.content || this.hasManyVariants)
    },

    isInfoActive () {
      return this.activeSection === 'info' || (!this.activeSection && this.hasInfo)
    },

    isPropertiesActive () {
      return this.activeSection === 'properties' || (!this.activeSection && !this.hasInfo && this.hasProperties)
    }
  },

  methods: {
    dasherize
  }
}
</script>
