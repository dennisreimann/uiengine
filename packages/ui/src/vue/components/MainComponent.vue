<template>
  <div>
    <section class="component">
      <ContentHeader :title="component.title">
        <ContentLabel
          v-if="component.label"
          inverted
        >
          {{ component.label }}
        </ContentLabel>
        <ContentTag
          v-for="tag in component.tags"
          :key="tag"
          :tag="tag"
        />
        <div
          role="tablist"
          class="contentheader__options"
        >
          <a
            v-if="fileLink"
            :href="fileLink"
            :aria-label="'options.edit' | localize"
            class="contentheader__action"
          >
            <AppIcon symbol="pencil" />
          </a>
          <a
            v-if="hasInfo"
            :id="tabId('info')"
            ref="info-tab"
            :aria-selected="isInfoActive"
            :tabindex="isInfoActive ? false : '-1'"
            role="tab"
            href="#info"
            class="contentheader__option"
            @click.prevent="activeSection = 'info'"
            @keydown.right="switchTab('properties')"
          >
            {{ 'options.info' | localize }}
          </a>
          <a
            v-if="hasProperties"
            :id="tabId('properties')"
            ref="properties-tab"
            :aria-selected="isPropertiesActive"
            :tabindex="isPropertiesActive ? false : '-1'"
            role="tab"
            href="#properties"
            class="contentheader__option"
            @click.prevent="activeSection = 'properties'"
            @keydown.left="switchTab('info')"
            @keydown.right="switchTab('theme-properties')"
          >
            {{ 'options.properties' | localize }}
          </a>
          <a
            v-if="hasThemeProperties"
            :id="tabId('theme-properties')"
            ref="theme-properties-tab"
            :aria-selected="isThemePropertiesActive"
            :tabindex="isThemePropertiesActive ? false : '-1'"
            role="tab"
            href="#theme-properties"
            class="contentheader__option"
            @click.prevent="activeSection = 'theme-properties'"
            @keydown.left="switchTab('properties')"
          >
            {{ 'options.theme_properties' | localize }}
          </a>
        </div>
      </ContentHeader>

      <div
        v-if="hasInfo || hasProperties || hasThemeProperties"
        class="uie-sot-xs"
      >
        <div
          v-if="hasInfo"
          :aria-labelledby="tabId('info')"
          :hidden="!isInfoActive"
          class="contentsection"
          role="tabpanel"
        >
          <ContentText :item="component" />

          <div
            v-if="hasSecondaryInfo"
            class="content uie-sot-l"
          >
            <hr>

            <template v-if="hasDependencies">
              <p>
                {{ 'component.dependencies' | localize }}
                <span
                  v-for="(dependency, index) in dependencies"
                  :key="dependency"
                >
                  <RouterLink
                    v-if="componentLink(dependency)"
                    :to="componentLink(dependency)"
                    class=""
                    active-class=""
                    exact-active-class=""
                  >
                    {{ componentById(dependency).title }}
                  </RouterLink>
                  <template v-else>
                    {{ componentById(dependency).title }}
                  </template>
                  <span class="divider">
                    {{ (index != dependencies.length - 1) ? ',' : '.' }}
                  </span>
                </span>
              </p>
            </template>

            <template v-if="hasDependentComponents">
              <p>
                {{ 'component.dependents' | localize }}
                <span
                  v-for="(dependent, index) in dependentComponents"
                  :key="dependent"
                >
                  <RouterLink
                    v-if="componentLink(dependent)"
                    :to="componentLink(dependent)"
                    class=""
                    active-class=""
                    exact-active-class=""
                  >
                    {{ componentById(dependent).title }}
                  </RouterLink>
                  <template v-else>
                    {{ componentById(dependent).title }}
                  </template>
                  <span class="divider">
                    {{ (index != dependentComponents.length - 1) ? ',' : '.' }}
                  </span>
                </span>
              </p>
            </template>

            <template v-if="hasManyVariants">
              <ul>
                <li
                  v-for="variant in variants"
                  :key="variant.id"
                >
                  <RouterLink
                    :to="{ hash: dasherize(variant.id) }"
                    class=""
                    active-class=""
                    exact-active-class=""
                  >
                    {{ variant.title }}
                  </RouterLink>
                </li>
              </ul>
            </template>
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
            <ContentProperties
              v-for="(properties, componentId) in component.properties"
              :key="componentId"
              :title="componentId"
              :properties="properties"
            />
          </div>
        </div>

        <div
          v-if="hasThemeProperties"
          :aria-labelledby="tabId('theme-properties')"
          :hidden="!isThemePropertiesActive"
          class="contentsection"
          role="tabpanel"
        >
          <ContentThemeProperties
            :title="'options.theme_properties' | localize"
            :theme-properties="component.themeProperties"
          />
        </div>
      </div>
    </section>

    <section
      v-if="hasVariants"
      class="variants"
    >
      <ComponentVariant
        v-for="variant in variants"
        :key="variant.id"
        :variant="variant"
      />
    </section>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { dasherize } from '@uiengine/util/src/string'
import Docs from '../mixins/docs'
import Preview from '../mixins/preview'
import ContentHeader from './ContentHeader'
import ContentText from './ContentText'
import ContentProperties from './ContentProperties'
import ContentThemeProperties from './ContentThemeProperties'
import ContentLabel from './ContentLabel'
import ContentTag from './ContentTag'
import ComponentVariant from './ComponentVariant'

export default {
  components: {
    ContentHeader,
    ContentText,
    ContentProperties,
    ContentThemeProperties,
    ContentLabel,
    ContentTag,
    ComponentVariant
  },

  mixins: [
    Docs,
    Preview
  ],

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
    ...mapGetters('state', ['components', 'config', 'navigation']),

    dependencies () {
      return this.component.dependencies.filter(dependency => this.componentById(dependency))
    },

    dependentComponents () {
      return this.component.dependentComponents.filter(dependent => this.componentById(dependent))
    },

    component () {
      return this.components[this.id]
    },

    variants () {
      return this.displayAllThemes
        ? this.component.variants
        : this.component.variants.filter(this.displayVariant)
    },

    hasDependencies () {
      return this.component.dependencies &&
        this.component.dependencies.filter(this.componentById).length > 0
    },

    hasDependentComponents () {
      return !!this.component.dependentComponents &&
        this.component.dependentComponents.filter(this.componentById).length > 0
    },

    hasVariants () {
      return this.variants.length > 0
    },

    hasManyVariants () {
      return this.variants.length > 1
    },

    hasProperties () {
      const { properties } = this.component
      return properties && Object.keys(properties).length > 0
    },

    hasThemeProperties () {
      const { themeProperties } = this.component
      return themeProperties && themeProperties.length > 0
    },

    hasInfo () {
      return !!(this.component.content || this.hasSecondaryInfo)
    },

    hasSecondaryInfo () {
      return this.hasManyVariants || this.hasDependencies || this.hasDependentComponents
    },

    isInfoActive () {
      return this.activeSection === 'info' || (!this.activeSection && this.hasInfo)
    },

    isPropertiesActive () {
      return this.activeSection === 'properties' || (!this.activeSection && !this.hasInfo && this.hasProperties)
    },

    isThemePropertiesActive () {
      return this.activeSection === 'theme-properties' || (!this.activeSection && !this.hasInfo && !this.hasProperties && this.hasThemeProperties)
    },

    fileLink () {
      return this.findFileLink(this.component)
    }
  },

  methods: {
    dasherize,

    componentLink (componentId) {
      return Object.values(this.navigation).find(item => item.type === 'component' && item.itemId === componentId)
    },

    componentById (componentId) {
      return this.components[componentId]
    },

    displayVariant (variant) {
      return !!(!variant.theme || this.currentTheme.id.includes(variant.theme))
    },

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

<style lang="stylus" scoped>
.divider
  margin-left -.45ch
  margin-right .45ch
</style>
