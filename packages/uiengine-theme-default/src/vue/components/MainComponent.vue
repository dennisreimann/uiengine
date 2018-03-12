<template>
  <div>
    <section class="component">
      <content-header :title="component.title">
        <content-label
          v-if="component.label"
          inverted
          class="sob-m"
        >{{ component.label }}</content-label>
        <content-tag
          v-for="tag in component.tags"
          :key="tag"
          :tag="tag"
          class="sob-m"
        />
        <div
          v-if="hasInfo && hasProperties"
          role="tablist"
          class="contentheader__options"
        >
          <a
            role="tab"
            ref="info-tab"
            href="#info"
            class="contentheader__option"
            :id="tabId('info')"
            :aria-selected="isInfoActive"
            :tabindex="isInfoActive ? false : '-1'"
            @click.prevent="activeSection = 'info'"
            @keydown.right="switchTab('properties')"
          >{{ 'options.info' | localize }}</a>
          <a
            role="tab"
            ref="properties-tab"
            href="#properties"
            class="contentheader__option"
            :id="tabId('properties')"
            :aria-selected="isPropertiesActive"
            :tabindex="isPropertiesActive ? false : '-1'"
            @click.prevent="activeSection = 'properties'"
            @keydown.left="switchTab('info')"
          > {{ 'options.properties' | localize }}</a>
        </div>
      </content-header>

      <div
        v-if="hasInfo || hasProperties"
        class="sot-xs"
      >
        <div
          v-if="hasInfo"
          class="contentsection"
          role="tabpanel"
          :aria-labelledby="tabId('info')"
          :hidden="!isInfoActive"
        >
          <div
            v-if="component.content"
            class="content"
            v-html="renderedContent"
          />
          <div
            v-if="hasManyVariants"
            class="content sot-l fs-s"
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
          class="contentsection"
          role="tabpanel"
          :aria-labelledby="tabId('properties')"
          :hidden="!isPropertiesActive"
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
        v-for="variant in component.variants"
        :key="variant.id"
        :variant="variant"
      />
    </section>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { dasherize, decorateContent } from '../../util'
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
    },

    renderedContent () {
      return this.component.content
        ? decorateContent(this.component)
        : null
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
