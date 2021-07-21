<script>
import Repository from '../components/Repository.vue'
import { REPOSITORIES, ORGANIZATION } from '../config'

export default {
  name: 'Github',
  components: {
    Repository,
  },
  data() {
    return {
      tab: REPOSITORIES[0].name,
      repositories: REPOSITORIES,
      organization: ORGANIZATION,
    }
  },
  methods: {
    handleClick(name) {
      this.tab = name
    }
  }
}
</script>

<template>
  <v-card>
    <v-toolbar>
      <template v-slot:extension>
        <v-tabs>
          <v-tabs-slider></v-tabs-slider>
          <v-tab
            v-for="item in repositories"
            :key="item.name"
            @click="handleClick(item.name)"
          >
            {{ item.displayName }}
          </v-tab>
        </v-tabs>
      </template>
    </v-toolbar>

    <Repository
      v-if="tab"
      :organization="organization"
      :repository="tab"
    />
  </v-card>
</template>
