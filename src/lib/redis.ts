import { Redis } from '@upstash/redis'
import { UPSTASH_REDIS_REST_AUTH_TOKEN, UPSTASH_REDIS_REST_AUTH_URL } from './contants'

export const redisClientforAuth = new Redis({
  url: UPSTASH_REDIS_REST_AUTH_URL,
  token: UPSTASH_REDIS_REST_AUTH_TOKEN,
})



