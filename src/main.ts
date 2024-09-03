import { yoga } from './graphql'

// @ts-ignore
Bun.serve({ fetch: yoga, port: 8080 })

console.log('listening on :8080')
