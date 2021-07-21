<script>
import MyPullRequests from './MyPullRequests.vue'
import PullRequestsGraph from './PullRequestsGraph.vue'
import ApprovedPullRequests from './ApprovedPullRequests.vue'
import TaggedPullRequests from './TaggedPullRequests.vue'
import { fetchPullRequests } from '../services/gql/github'
import { GITHUB_USERNAME } from '../config'
import { Graph } from '../utils/graph'

export default {
  name: 'Repository',
  components: {
    ApprovedPullRequests,
    MyPullRequests,
    PullRequestsGraph,
    TaggedPullRequests,
  },
  props: {
    organization: {
      type: String,
      required: true,
    },
    repository: {
      type: String,
      required: true,
    }
  },
  data() {
    return {
      pullRequests: [],
      baseBranch: 'develop',
      loading: false,
    }
  },
  mounted() {
    this.setPullRequests(this.organization, this.repository)
    setInterval(() => {
      this.setPullRequests(this.organization, this.repository)
    }, 60000)
  },
  watch: {
    repository(repository) {
      this.setPullRequests(this.organization, repository)
      this.baseBranch = 'develop'
    },
  },
  methods: {
    async setPullRequests(org, repo) {
      this.loading = true
      try {
        const pullRequests = await fetchPullRequests(org, repo)
        this.pullRequests = pullRequests
      } catch (error) {
        console.error('Ohhhh crap', error)
      } finally {
        this.loading = false
      }
    },
    changeBaseBranch(name) {      
      this.baseBranch = name
    }
  },
  computed: {
    branches() {
      const branches = this.pullRequests.map(pr => {
        return pr.headRef.name
      })
      return ['develop', ...branches]
    },
    myPullRequests() {
      return this.pullRequests.filter(pr => {
        return pr.author.login === GITHUB_USERNAME
      })
    },
    taggedPullRequests() {
      return this.pullRequests.filter(pr => {
        return pr.reviewRequests.nodes.find(request => {
          return request.requestedReviewer.login === GITHUB_USERNAME
        })
      })
    },
    approvedPullRequests() {
      return this.pullRequests.filter(pr => {
        // Get all PRs that I've left an 'APPROVAL' on
        return pr.reviews.nodes.find(review => {
          return review.author.login === GITHUB_USERNAME && review.state === 'APPROVED'
        }) ? true : false
      })
    },
    graphNodes() {
      const graph = new Graph()
      this.pullRequests.forEach(pr => {        
        graph.addLink(pr.headRef.name, pr.baseRefName)
      })
      
      const tree = graph.asTree(this.baseBranch)
      
      return tree
    }
  }
}
</script>

<template>
  <v-card class="mt-10">
    <MyPullRequests 
      class="mb-10" 
      :pull-requests="myPullRequests" 
      :loading="loading"
    />
    <TaggedPullRequests 
      class="mb-10" 
      :pull-requests="taggedPullRequests" 
      :loading="loading"
    />
    <ApprovedPullRequests 
      class="mb-10" 
      :pull-requests="approvedPullRequests" 
      :loading="loading"
    />
    <h3 class="ml-5 text-h6">Pull Requests Tree</h3>
    <br>
    <v-col
      cols="12"
      sm="6"
    >
      <v-select
        :items="branches"
        label="Base Branch"
        @change="changeBaseBranch"
      />
    </v-col>
    <PullRequestsGraph 
      v-if="graphNodes[0].children.length > 0" 
      @base-branch-change="changeBaseBranch"
      :branches="branches" 
      :tree="graphNodes"
      :loading="loading"
      class="pb-5" 
    />
    <v-col
      v-else
      cols="12"
      sm="12"
    >
     <h4 style="text-align: center;">No Pull Requests to merge into {{ baseBranch }}</h4>
    </v-col>
  </v-card>
</template>
