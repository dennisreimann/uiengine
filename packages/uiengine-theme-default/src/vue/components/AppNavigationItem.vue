<template>
  <li :id="elId | dasherize" class="navigation__item" :class="elClass">
    <span class="navigation__link" v-if="item.isStructural">{{ item.title }}</span>
    <router-link :to="item" class="navigation__link" v-else>{{ item.title }}</router-link>
    <div v-if="children">
      <button class="navigation__itemtoggle" :data-target="elId">
        <!-- +icon('caret-down').navigation__icon -->
      </button>
      <app-navigation-tree :navigation="navigation" :items="children" :level="level + 1" />
    </div>
  </li>
</template>

<script>
import { mapGetters } from 'vuex'
import AppNavigationTree from './AppNavigationTree'

export default {
  components: {
    AppNavigationTree
  },

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
    // li.navigation__item(id=id class=classes)
    //   script.
    //     if (window.sessionStorage.getItem('#{id}-collapsed') === 'true') {
    //       document.getElementById('#{id}').classList.add('navigation__item--collapsed')
    //     }
    //   if item.isStructural
    //     span.navigation__link= item.title
    //   else
    //     a.navigation__link(href=h.pageLink(item))= item.title
  computed: {
    children () {
      return this.item.childIds
    },

    elId () {
      return `navitem-${this.item.id}`
    },

    elClass () {
      const classList = [`navigation__item--level-${this.level}`]
      this.children.length ? classList.push('navigation__item--children') : false
      // TODO:
      // - h.isCurrentPage(item) ? classList.push('navigation__item--current') : false
      // - h.isActivePage(item) ? classList.push('navigation__item--active') : false
      return classList.join(' ')
    }
  }
}
</script>
