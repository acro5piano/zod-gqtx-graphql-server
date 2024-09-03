import { buildGraphQLSchema } from 'gqtx'
import { createYoga } from 'graphql-yoga'
import { QueryType } from './QueryType'
import { MutationType } from './MutationType'

export const schema = buildGraphQLSchema({
  query: QueryType,
  mutation: MutationType,
})

export const yoga = createYoga({
  schema,
  graphqlEndpoint: '/api/graphql',
  healthCheckEndpoint: '/api/health',
  logging: 'debug',
})
