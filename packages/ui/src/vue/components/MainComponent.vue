<template>
  <div>
    <section class="component">
      <content-header :title="component.title">
        <content-label
          v-if="component.label"
          inverted
        >{{ component.label }}</content-label>
        <content-tag
          v-for="tag in component.tags"
          :key="tag"
          :tag="tag"
        />
        <div
          v-if="hasInfo && hasProperties"
          role="tablist"
          class="contentheader__options"
        >
          <a
            ref="info-tab"
            :id="tabId('info')"
            :aria-selected="isInfoActive"
            :tabindex="isInfoActive ? false : '-1'"
            role="tab"
            href="#info"
            class="contentheader__option"
            @click.prevent="activeSection = 'info'"
            @keydown.right="switchTab('properties')"
          >{{ 'options.info' | localize }}</a>
          <a
            ref="properties-tab"
            :id="tabId('properties')"
            :aria-selected="isPropertiesActive"
            :tabindex="isPropertiesActive ? false : '-1'"
            role="tab"
            href="#properties"
            class="contentheader__option"
            @click.prevent="activeSection = 'properties'"
            @keydown.left="switchTab('info')"
          > {{ 'options.properties' | localize }}</a>
        </div>
      </content-header>

      <div
        v-if="hasInfo || hasProperties"
        class="uie-sot-xs"
      >
        <div
          v-if="hasInfo"
          :aria-labelledby="tabId('info')"
          :hidden="!isInfoActive"
          class="contentsection"
          role="tabpanel"
        >
          <content-text :item="component" />
          <div
            v-if="hasManyVariants"
            class="content uie-sot-l uie-fs-s"
          >
            <ul>
              <li
                v-for="variant in component.variants"
                :key="variant.id"
              >
                <router-link
                  :to="{ hash: dasherize(variant.id) }"
                  class=""
                  active-class=""
                  exact-active-class=""
                >{{ variant.title }}</router-link>
              </li>
            </ul>
          </div>
        </div>

        <div
          v-if="hasProperties"
          :aria-labelledby="tabId('properties')"
          :hidden="!isPropertiesActive"
          class="contentsection"
          role="tabpanel"
        >
          <div class="content">
            <content-properties
              v-for="(properties, componentId) in component.properties"
              :key="componentId"
              :title="componentId"
              :entities="entities"
              :properties="properties"
              class="uie-sob-xl"
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
        v-for="variant in component.variants"
        :key="variant.id"
        :variant="variant"
      />
    </section>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { dasherize } from '@uiengine/util/lib/string'
import ContentHeader from './ContentHeader'
import ContentHeading from './ContentHeading'
import ContentText from './ContentText'
import ContentProperties from './ContentProperties'
import ContentLabel from './ContentLabel'
import ContentTag from './ContentTag'
import ComponentVariant from './ComponentVariant'

export default {
  components: {
    ContentHeader,
    ContentHeading,
    ContentText,
    ContentProperties,
    ContentLabel,
    ContentTag,
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
    ...mapGetters('state', ['components', 'entities']),

    component () {
      return this.components[this.id]
    },

    hasVariants () {
      return this.component.variants.length > 0
    },

    hasManyVariants () {
      return this.component.variants.length > 1
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
    dasherize,

    tabId (section) {
      return `${dasherize(this.component.id)}-${section}`
    },

    switchTab (section) {
      this.activeSection = section
      this.$refs[`${section}-tab`].focus()
    }
  }
}
</script>
