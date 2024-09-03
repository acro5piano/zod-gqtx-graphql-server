import { Gql } from 'gqtx'
import { zodTypeToGqlFields } from '../util'
import { PostSchema, type Post } from '../models/post'

export const PostType = Gql.Object<Post>({
  name: 'Post',
  fields: () => zodTypeToGqlFields(PostSchema),
})
