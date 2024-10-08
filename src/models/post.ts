import { z } from 'zod'
import { brandedUuid, type MakeId, type NullishObject } from '../util'
import type { UserId } from './user'

export type PostId = MakeId<'Post'>

export const PostSchema = z.object({
  id: brandedUuid<PostId>(),
  userId: brandedUuid<UserId>(),
  title: z.string().min(5).max(50),
})
export type Post = z.infer<typeof PostSchema>

export const PostInputSchema = PostSchema.pick({ title: true })
export type PostInputType = NullishObject<z.infer<typeof PostInputSchema>>
