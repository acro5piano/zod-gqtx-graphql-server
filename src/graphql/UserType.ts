import { Gql } from 'gqtx'
import { db } from '../db'
import { zodTypeToGqlFields } from '../util'
import { PublicUserSchema, type PublicUserType } from '../models/user'
import { PostType } from './PostType'

export const UserType = Gql.Object<PublicUserType>({
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
