import { Gql } from 'gqtx'
import { PostInputSchema, type PostInputType } from '../models/post'
import { zodTypeToGqlInputFields } from '../util'

export const PostInput = Gql.InputObject<PostInputType>({
  name: 'CreatePostInput',
  fields: () => zodTypeToGqlInputFields(PostInputSchema),
})
