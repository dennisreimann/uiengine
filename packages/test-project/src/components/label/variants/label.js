import MyLabel from '../label-export'

export default {
  name: 'MyVariant',
  components: { MyLabel },
  template: '<my-label :title="title" :for="for" />'
}
