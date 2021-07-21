<script>
import { GITHUB_USERNAME } from '../config'

export default {
  name: 'MyPullRequests',
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
    getUnaddressedComments(pr) {
      // A comment can have many replies, which is why it's necessary to get [0] index
      const comments = pr.reviewThreads.nodes.filter(review => {
        return review.comments.nodes[0].author.login !== GITHUB_USERNAME
      })

      const addressedComments = comments.filter(comment => {
        return !comment.isResolved && !comment.isOutdated
      })
      return addressedComments.length
    }
  }
}
</script>


<template>
<v-card class="pl-5" :loading="loading">
  <h3 class="text-h6">My Pull Requests</h3>
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
          <th class="text-left">
            Comments To Address
          </th>
          <th class="text-left" width="200">
            Merge Conflicts
          </th>
          <th class="text-left" width="200">
            Latest Build
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
          <td>{{ getUnaddressedComments(item) }}</td>
          <td>{{ item.mergeable }}</td>
          <td>{{ item.commits.nodes[0].commit.status.state }}</td>
        </tr>
      </tbody>
    </template>
  </v-simple-table>
</v-card>
</template>