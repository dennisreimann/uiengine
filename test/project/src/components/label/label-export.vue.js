import props from './props'

export default {
  name: 'MyLabel',

  props,

  template: '<label class="label" :for="id">{{ title }}</label>'
}
