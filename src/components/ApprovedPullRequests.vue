<script>
import { GITHUB_USERNAME } from '../config'

export default {
  name: 'ApprovedPullRequests',
  props: {
    pullRequests: {
      type: Array,
      required: true,
    },
    loading: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    getStaleComments(pr) {
      const staleComments = pr.reviewThreads.nodes.filter(review => {
        return !review.isResolved && review.isOutdated && review.comments.nodes[0].author.login === GITHUB_USERNAME
      })
      return staleComments.length
    }
  }
}
</script>

<template>
<v-card class="pl-5" :loading="loading">
  <h3 class="text-h6">Approved Pull Requests</h3>
  <v-simple-table>
    <template v-slot:default>
      <thead>
        <tr>
          <th class="text-left" width=500>
            Title
          </th>
          <th class="text-left" width=200>
            Author
          </th>
          <th>
            Stale Comments 
            <v-tooltip top>
              <template v-slot:activator="{ on, attrs}">
                <v-icon 
                  size="medium"
                  v-bind="attrs"
                  v-on="on"
                >
                  mdi-information
                </v-icon>
              </template>
              <span>
                Number of unresolved, outdated comments you've made. <br>
                Any non-zero number means you should take a look at the PR.
              </span>
            </v-tooltip>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="item in pullRequests"
          :key="item.title"
        >
          <td><a :href="item.url" target="_blank">{{ item.title }}</a></td>
          <td>{{ item.author.login }}</td>
          <td>{{ getStaleComments(item) }}</td>
        </tr>
      </tbody>
    </template>
  </v-simple-table>
</v-card>
</template>