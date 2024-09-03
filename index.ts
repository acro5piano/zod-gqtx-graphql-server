import { buildGraphQLSchema, Gql, type Field } from 'gqtx'
import { createYoga } from 'graphql-yoga'
import { z } from 'zod'

export function keys<T extends object>(obj: T) {
  return Object.keys(obj) as Array<keyof T>
}

const UserSchema = z.object({
  id: z.string().uuid().brand<'User'>(),
  name: z.string().min(3),
  password: z.string().min(8),
})
type User = z.infer<typeof UserSchema>

const PostSchema = z.object({
  id: z.string().uuid().brand<'Post'>(),
  userId: z.string().uuid().brand<'User'>(),
  title: z.string().min(5).max(50),
})
type Post = z.infer<typeof PostSchema>

const PublicUserFields = UserSchema.omit({ password: true })
type F = z.infer<typeof PublicUserFields>

type UserFields = [Field<F, any, {}>, ...Field<F, any, {}>[]]

const UserType = Gql.Object<F>({
  name: 'User',
  fields: () => {
    const fields: UserFields = [
      Gql.Field({ name: 'id', type: Gql.NonNull(Gql.ID) }),
    ]
    for (const key of keys(PublicUserFields.shape)) {
      fields.push(Gql.Field({ name: key, type: Gql.NonNull(Gql.String) }))
    }
    fields.push(
      Gql.Field({
        name: 'hoge',
        type: Gql.NonNull(Gql.String),
        resolve: () => 'hoge',
      }),
    )
    return fields
  },
})

// const CreateUserInput = Gql.InputObject({
//   name: 'CreateUserInput',
//   fields: () => UserSchema.omit({ password: true }),
// })

type Database = {
  user: User[]
  post: Post[]
}

const db: Database = {
  user: [],
  post: [],
}

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

// const MutationType = Gql.Query({
//   fields: () => [
//     Gql.Field({
//       name: 'createUser',
//       type: Gql.NonNull(Gql.List(Gql.NonNull(UserType))),
//       args: {
//         input: Gql.Arg({ type: Gql.NonNullInput(CreateUserInput) }),
//       },
//       resolve: (_, args) => {
//         return db.user.push(args.input)
//       },
//     }),
//     // Gql.Field({
//     //   name: 'createPost',
//     //   type: Gql.NonNull(Gql.List(Gql.NonNull(UserType))),
//     //   resolve: (_) => {
//     //     return db.user
//     //   },
//     // }),
//   ],
// })

export const schema = buildGraphQLSchema({
  query: QueryType,
  // mutation: MutationType,
})

export const yoga = createYoga({
  schema,
  graphqlEndpoint: '/api/graphql',
  healthCheckEndpoint: '/api/health',
  logging: 'debug',
})

// @ts-ignore
Bun.serve({ fetch: yoga, port: 8080 })

console.log('listening on :8080')
