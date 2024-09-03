import type { Post } from './models/post'
import type { User } from './models/user'

export type Database = {
  user: User[]
  post: Post[]
}

// Fake database for demo purpose
export const db: Database = {
  user: [],
  post: [],
}
