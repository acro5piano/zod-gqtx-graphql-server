import { buildGraphQLSchema, Gql } from 'gqtx'
import { createYoga } from 'graphql-yoga'
import { nanoid } from 'nanoid'
import { v4 } from 'uuid'
import { db } from './db'

import { zodTypeToGqlFields, zodTypeToGqlInputFields } from './util'
import {
  CreateUserSchema,
  PublicUserSchema,
  UserSchema,
  type CreateUserType,
  type PublicUserType,
} from './models/user'
import {
  CreatePostSchema,
  PostSchema,
  type CreatePostType,
  type Post,
} from './models/post'

const UserType = Gql.Object<PublicUserType>({
  name: 'User',
  fields: () =>
    zodTypeToGqlFields(
      PublicUserSchema,
      Gql.Field({
        name: 'greeting',
        type: Gql.NonNull(Gql.String),
        resolve: (user) => {
          return `Hello, ${user.name}`
        },
      }),
      Gql.Field({
        name: 'posts',
        type: Gql.NonNull(Gql.List(Gql.NonNull(PostType))),
        resolve: (user) => {
          return db.post.filter((p) => p.userId === user.id)
        },
      }),
    ),
})

const CreateUserInput = Gql.InputObject<CreateUserType>({
  name: 'CreateUserInput',
  fields: () => zodTypeToGqlInputFields(CreateUserSchema),
})

const PostType = Gql.Object<Post>({
  name: 'Post',
  fields: () => zodTypeToGqlFields(PostSchema),
})

const CreatePostInput = Gql.InputObject<CreatePostType>({
  name: 'CreatePostInput',
  fields: () => zodTypeToGqlInputFields(CreatePostSchema),
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
    Gql.Field({
      name: 'createPost',
      type: Gql.NonNull(PostType),
      args: {
        userId: Gql.Arg({ type: Gql.NonNullInput(Gql.ID) }),
        input: Gql.Arg({ type: Gql.NonNullInput(CreatePostInput) }),
      },
      resolve: (_, args) => {
        const post = PostSchema.parse({
          id: v4(),
          userId: args.userId,
          ...args.input,
        })
        db.post.push(post)
        return post
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
