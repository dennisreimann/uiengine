<template>
  <div v-if="type === 'color'">
    <h2 v-if="title" class="sot-xl sob-m">{{ title }}</h2>
    <div class="tokens tokens--color sob-xxl">
      <token-color v-for="token in tokens" :key="token.name" :token="token" />
    </div>
  </div>

  <table v-else class="tokens tokens--default sot-m sob-xxl">
    <caption v-if="title" class="tokens__title">{{ title }}</caption>
    <thead>
      <tr>
        <th class="defaultToken__label defaultToken__label--name">{{ 'token.name' | localize }}</th>
        <th class="defaultToken__label defaultToken__label--value">{{ 'token.value' | localize }}</th>
        <th class="defaultToken__label defaultToken__label--variable" v-if="hasVariableProperty">{{ 'token.variable' | localize }}</th>
        <th class="defaultToken__label defaultToken__label--description" v-if="hasDescriptionProperty">{{ 'token.description' | localize }}</th>
        <th class="defaultToken__label defaultToken__label--reference" v-if="hasReferenceProperty">{{ 'token.reference' | localize }}</th>
      </tr>
    </thead>
    <tbody>
      <token-default v-for="token in tokens"
        :key="token.name"
        :token="token"
        :columns="{
          variable: hasVariableProperty,
          description: hasDescriptionProperty,
          reference: hasReferenceProperty
        }" />
    </tbody>
  </table>
</template>

<script>
import TokenColor from './TokenColor'
import TokenDefault from './TokenDefault'

export default {
  props: {
    tokens: {
      required: true
    },

    title: {
      type: String
    }
  },

  components: {
    TokenColor,
    TokenDefault
  },

  computed: {
    type () {
      return ((this.tokens && this.tokens[0].type) || '').split('/')[0]
    },

    hasVariableProperty () {
      return this.tokens.some(this.haveProperty('variable'))
    },

    hasDescriptionProperty () {
      return this.tokens.some(this.haveProperty('description'))
    },

    hasReferenceProperty () {
      return this.tokens.some(this.haveProperty('reference'))
    }
  },

  methods: {
    haveProperty (property) {
      return element => element[property]
    }
  }
}
</script>
