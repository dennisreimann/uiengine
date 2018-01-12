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
          v-if="hasInfo && hasSchema"
          class="contentheader__options"
        >
          <a
            href="#info"
            class="contentheader__option"
            :class="{ 'contentheader__option--active': isInfoActive }"
            @click.prevent="activeSection = 'info'"
          >{{ 'component.info' | localize }}</a>
          <a
            href="#schema"
            class="contentheader__option"
            :class="{ 'contentheader__option--active': isSchemaActive }"
            @click.prevent="activeSection = 'schema'"
          > {{ 'component.schema' | localize }}</a>
        </div>
      </content-header>

      <div
        v-if="hasInfo || hasSchema"
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
          v-if="hasSchema"
          class="contentsection"
          :class="{ 'contentsection--active': isSchemaActive }"
        >
          <div class="content">
            <content-scheme
              v-for="(properties, schemeId) in component.schema"
              :key="schemeId"
              :schema="schema"
              :title="schemeId"
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
import ContentScheme from './ContentScheme'
import ComponentLabel from './ComponentLabel'
import ComponentVariant from './ComponentVariant'

export default {
  components: {
    ContentHeader,
    ContentHeading,
    ContentScheme,
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
