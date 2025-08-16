import {
  ApolloClient,
  InMemoryCache,
  createHttpLink,
  split
} from '@apollo/client'
import { GraphQLWsLink } from '@apollo/client/link/subscriptions'
import { setContext } from '@apollo/client/link/context'
import { getMainDefinition } from '@apollo/client/utilities'
import { createClient } from 'graphql-ws'
import { nhost } from './nhost'

const httpLink = createHttpLink({ 
  uri: import.meta.env.VITE_HASURA_ENDPOINT 
})

const wsLink = new GraphQLWsLink(createClient({
  url: import.meta.env.VITE_HASURA_ENDPOINT.replace('https://', 'wss://'),
  connectionParams: () => ({
    headers: { 
      Authorization: `Bearer ${nhost.auth.getAccessToken()}` 
    }
  })
}))

const authLink = setContext((_, { headers }) => ({
  headers: { 
    ...headers, 
    Authorization: `Bearer ${nhost.auth.getAccessToken()}` 
  }
}))

const splitLink = split(
  ({ query }) => {
    const def = getMainDefinition(query)
    return def.kind === 'OperationDefinition' && def.operation === 'subscription'
  },
  wsLink,
  authLink.concat(httpLink)
)

export const apolloClient = new ApolloClient({
  link: splitLink,
  cache: new InMemoryCache()
})