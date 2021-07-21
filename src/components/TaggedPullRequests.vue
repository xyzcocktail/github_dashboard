<script>
import { GITHUB_USERNAME } from '../config'

export default {
  name: 'TaggedPullRequests',
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
      // A comment can have many replies, but the [0] one will always be the initial reviewer
      const myComments = pr.reviewThreads.nodes.filter(review => {
        return review.comments.nodes[0].author.login === GITHUB_USERNAME
      })

      const addressedComments = myComments.filter(comment => {
        return !comment.isResolved && comment.isOutdated
      })
      return {
        addressed: addressedComments.length,
        all: myComments.length,
      }
    }
  }
}
</script>

<template>
<v-card class="pl-5" :loading="loading">
  <h3 class="text-h6">Tagged Pull Requests</h3>
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
            Addressed/Of
            <v-tooltip top>
              <template v-slot:activator="{on, attrs}">
                <v-icon 
                  size="medium"
                  v-bind="attrs"
                  v-on="on"
                >
                  mdi-information
                </v-icon>
              </template>
              <span>
                Number of comments you've left on a PR versus the number of comments the author has addressed.<br>
                If these two number are equal, it means you either need to re-review the PR or approve it.
              </span>
            </v-tooltip>
          </th>   
          <th class="text-left" width=200>
            Merge Conflicts
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
          <td>{{ getUnaddressedComments(item).addressed }}/{{ getUnaddressedComments(item).all }}</td>
          <td>{{ item.mergeable }}</td>
        </tr>
      </tbody>
    </template>
  </v-simple-table>
</v-card>
</template>