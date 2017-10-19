export default {
  name: 'MyLabel',
  props: ['for', 'title'],
  template: '<label class="label" :for="for">{{ title }}</label>'
}
