import MyLabel from '../label-export.vue.js'

export default {
  name: 'MyVariant',

  props: {
    id: String,
    title: String
  },

  components: {
    MyLabel
  },

  template: '<my-label :id="id" :title="title" />'
}
