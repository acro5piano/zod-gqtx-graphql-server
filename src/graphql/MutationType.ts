import { Gql } from 'gqtx'
import { nanoid } from 'nanoid'
import { v4 } from 'uuid'
import { db } from '../db'
import { UserType } from './UserType'
import { UserInput } from './UserInput'
import { UserSchema } from '../models/user'
import { PostType } from './PostType'
import { PostInput } from './PostInput'
import { PostSchema } from '../models/post'

export const MutationType = Gql.Mutation({
  fields: () => [
    Gql.Field({
      name: 'createUser',
      type: Gql.NonNull(UserType),
      args: {
        input: Gql.Arg({ type: Gql.NonNullInput(UserInput) }),
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
        input: Gql.Arg({ type: Gql.NonNullInput(PostInput) }),
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
