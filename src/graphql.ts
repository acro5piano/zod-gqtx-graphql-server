import { buildGraphQLSchema, Gql } from 'gqtx'
import { createYoga } from 'graphql-yoga'
import { nanoid } from 'nanoid'
import { v4 } from 'uuid'
import { db } from './db'

import { zodTypeToGqlFields, zodTypeToGqlInputFields } from './util'
import {
  CreateUserParams,
  PublicUserFields,
  UserSchema,
  type CreateUserParamsTypeNullish,
  type PublicUserType,
} from './models/user'

const UserType = Gql.Object<PublicUserType>({
  name: 'User',
  fields: zodTypeToGqlFields(
    PublicUserFields,
    Gql.Field({
      name: 'greeting',
      type: Gql.NonNull(Gql.String),
      resolve: (user) => {
        return `Hello, ${user.name}`
      },
    }),
  ),
})

const CreateUserInput = Gql.InputObject<CreateUserParamsTypeNullish>({
  name: 'CreateUserInput',
  fields: zodTypeToGqlInputFields(CreateUserParams),
})

const QueryType = Gql.Query({
  fields: () => [
    Gql.Field({
      name: 'users',
      type: Gql.NonNull(Gql.List(Gql.NonNull(UserType))),
      resolve: (_) => {
        return db.user.map((u) => ({ id: u.id, name: u.name }))
      },
    }),
  ],
})

const MutationType = Gql.Mutation({
  fields: () => [
    Gql.Field({
      name: 'createUser',
      type: Gql.NonNull(UserType),
      args: {
        input: Gql.Arg({ type: Gql.NonNullInput(CreateUserInput) }),
      },
      resolve: (_, args) => {
        const user = UserSchema.parse({
          id: v4(),
          password: nanoid(),
          ...args.input,
        })
        db.user.push(user)
        return user
      },
    }),
  ],
})

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
