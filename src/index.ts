/**
 * This is the main entry point for the next-limit library.
 * It exports all the public classes, types, and functions that are intended
 * for consumers of the library.
 */

export { RateLimiter } from './core/rate-limiter'
export type { RateLimiterOptions } from './core/rate-limiter'
export type { RateLimiterResult } from './core/strategy'
export { createRedisStorage, createMemoryStorage } from './helpers'
export { expressMiddleware } from './middleware/express'
export { fastifyMiddleware } from './middleware/fastify'
