
<script>
import { fetchUser } from '../services/gql/github'
import { GITHUB_USERNAME } from '../config'

export default {
  name: 'Navigation',
  props: {
    items: {
      type: Array,
      default: [],
    }
  },
  data() {
    return {
      avatarUrl: '',
      name: '',
      drawer: false,
      mini: true,
    }
  },
  mounted(){
    this.setUser(GITHUB_USERNAME)
  },
  methods: {
    async setUser(username) {
      try {
        const user = await fetchUser(username)
        this.avatarUrl = user.avatarUrl
        this.name = user.name
      } catch (error) {
        console.error('Ohhhh crap', error)
      }    
    }
  },  
}
</script>

<template>
  <v-navigation-drawer
    v-model="drawer"
    :mini-variant.sync="mini"
    permanent
    app
  >
    <v-list-item 
      class="px-2">
      <v-list-item-avatar>
        <v-img :src="avatarUrl"></v-img>
      </v-list-item-avatar>

      <v-list-item-title>{{ name  }}</v-list-item-title>

      <v-btn
        icon
        @click.stop="mini = !mini"
      >
        <v-icon>mdi-chevron-left</v-icon>
      </v-btn>
    </v-list-item>

    <v-divider></v-divider>

    <v-list dense>
      <v-list-item
        v-for="item in items"
        :key="item.title"
        link
        router 
        :to="item.to"
      >
        <v-list-item-icon>
          <v-icon>{{ item.icon }}</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title>{{ item.title }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>