import { z } from 'zod'

export const PostSchema = z.object({
  id: z.string().uuid().brand<'Post'>(),
  userId: z.string().uuid().brand<'User'>(),
  title: z.string().min(5).max(50),
})
export type Post = z.infer<typeof PostSchema>
