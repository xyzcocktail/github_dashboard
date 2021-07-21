import { apolloClient } from '..'
import gql from 'graphql-tag'

const pullRequestsQuery = gql`
  query($organization: String!, $repository: String!) {
    organization(login: $organization) {
      repository(name: $repository) {
        pullRequests(first:100, states:OPEN) {
          nodes {
            title
            url
            author { login } # Pull Request Author
            headRef { name } # Branch
            baseRefName
            mergeable
            reviewRequests(first:7) { # Tagged reviewers
              nodes {
                requestedReviewer {
                  ... on User {
                    name
                    login
                  }
                }
              }
            }
            reviews(first:10){
              nodes { 
                author { login }
                state # If the PR has been approved
              }
            }
            reviewThreads(first:100) {
              nodes {
                isResolved
                isOutdated
                comments(first:1) { # A review thread can have many many responses, but the first one will always be the review author
                  nodes {
                    author { login }
                  }
                }
              }
            }
            commits(last:1) { # Whether the latest built passed or failed
              nodes {
                commit {
                  status {
                    state
                  }
                }
              }
            }            
          }
        }
      }
    }
  }
`

export const fetchPullRequests = async (organization, repository) => {
  const response = await apolloClient.query({
    query: pullRequestsQuery,
    variables: {
      organization, 
      repository,
    },
    fetchPolicy: 'network-only',
  })

  const { data } = response

  if (data && data.organization) {
    const pullRequests = data.organization.repository.pullRequests.nodes.filter(pr => {      
      return pr.author.__typename !== 'Bot'
    })
    console.log('pullRequests', pullRequests);
    return pullRequests
    
  }

  throw new Error('Unable to query pull requests')
}

const userQuery = gql`
  query($username: String!) {
    user(login: $username) {
      avatarUrl
      name
    }
  }
`


export const fetchUser = async (username) => {
  const response = await apolloClient.query({
    query: userQuery,
    variables: {
      username,
    },
    fetchPolicy: 'network-only',
  })

  const { data } = response

  if (data && data.user) {
    return data.user
  }

  throw new Error('Unable to query pull requests')
}