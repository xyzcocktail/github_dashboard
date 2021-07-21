<script>
  import Navigation from './components/Navigation.vue'

  export default {
    name: 'App',
    components: {
      Navigation,
    },
    data () {
      return {
        items: [
          { 
            title: 'Home', 
            icon: 'mdi-home-city',
            to: '/',
          },
          { 
            title: 'My Account', 
            icon: 'mdi-account',
            to: '/account',
          },
          { 
            title: 'Github', 
            icon: 'mdi-merge',
            to: '/github/',
           },
        ],
      }
    },
  }
</script>

<template>
  <v-app>
    <v-main>
      <Navigation :items="items" />
      <router-view></router-view>
    </v-main>
  </v-app>
</template>
