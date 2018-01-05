<template>
  <li class="navigation__item" :class="classes">
    <span class="navigation__link" v-if="item.isStructural">{{ item.title }}</span>
    <router-link :to="item" class="navigation__link" v-else>{{ item.title }}</router-link>
    <button class="navigation__itemtoggle" v-if="hasChildren" @click.prevent="setCollapsed(!isCollapsed)">
      <app-icon symbol="caret-down" class="navigation__icon" />
    </button>
    <app-navigation-tree :navigation="navigation" :items="children" :level="level + 1" v-if="hasChildren" />
  </li>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'

export default {
  props: {
    navigation: {
      type: Object,
      required: true
    },

    item: {
      type: Object,
      required: true
    },

    level: {
      type: Number,
      required: true
    }
  },

  methods: {
    ...mapMutations('preferences', ['setNavigationItemsCollapsed']),

    setCollapsed (collapsed) {
      const itemsCollapsed = this.navigationItemsCollapsed
      itemsCollapsed[this.item.id] = collapsed
      this.setNavigationItemsCollapsed(itemsCollapsed)
    }
  },

  computed: {
    ...mapGetters('preferences', ['navigationItemsCollapsed']),

    children () {
      return this.item.childIds
    },

    hasChildren () {
      return this.children.length
    },

    isCurrentPage () {
      return this.$route.path === this.item.path
    },

    isCollapsed () {
      return this.navigationItemsCollapsed[this.item.id] || false
    },

    classes () {
      const classes = [`navigation__item--level-${this.level}`]

      if (this.hasChildren) classes.push('navigation__item--children')
      if (this.isCollapsed) classes.push('navigation__item--collapsed')
      if (this.isCurrentPage) classes.push('navigation__item--current')

      return classes
    }
  }
}
</script>
