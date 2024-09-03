import { Gql } from 'gqtx'
import { db } from '../db'
import { UserType } from './UserType'

export const QueryType = Gql.Query({
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
