import { InMemoryCache } from 'apollo-cache-inmemory'
import { ApolloClient } from 'apollo-client'
import { ApolloLink } from 'apollo-link';
import { from } from 'apollo-link'
import { onError } from 'apollo-link-error'
import { HttpLink } from 'apollo-link-http'
import Vue from 'vue'
import VueApollo from 'vue-apollo'
import { GITHUB_BEARER_TOKEN } from '../../config'

Vue.use(VueApollo)

const httpLink = new HttpLink({
  uri: 'https://api.github.com/graphql',
})

export const authMiddleware = new ApolloLink((operation, forward) => {
  // add the authorization to the headers  
  operation.setContext({
    headers: {
      authorization: `Bearer ${GITHUB_BEARER_TOKEN}`
    }
  })
  return forward(operation)
})

const errorMiddleware = onError((errorResponse) => {
  console.error('errorResponse', errorResponse);
})

export const apolloClient = new ApolloClient({
  link: from([authMiddleware, errorMiddleware, httpLink]),
  cache: new InMemoryCache(),
  connectToDevTools: process.env.NODE_ENV === 'development',
  defaultOptions: {
    watchQuery: {
      errorPolicy: 'all',
    },
    query: {
      errorPolicy: 'all',
    },
    mutate: {
      errorPolicy: 'all',
    },
  },
})

export const apolloProvider = new VueApollo({
  defaultClient: apolloClient,
})
