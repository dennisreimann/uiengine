export default {
  name: 'MyLabel',
  props: {
    id: String,
    title: String
  },
  template: '<label class="label" :for="id">{{ title }}</label>'
}
