/**
 * Entry point for the next-limit package.
 * This file exports the essential modules for consumers of the library.
 */

// Core
export { RateLimiter } from './core/rate-limiter'
export type {
    RateLimiterOptions,
    BuiltInStrategyName,
} from './core/rate-limiter'
export type { RateLimiterResult, RateLimitStrategy } from './core/strategy'

// Storage
export type { StorageAdapter } from './core/storage'
export { MemoryStorageAdapter } from './core/memory-storage-adapter'
export { RedisStorageAdapter } from './core/redis-storage-adapter'

// Strategies
export { FixedWindowStrategy } from './strategies/fixed-window'
export { SlidingWindowStrategy } from './strategies/sliding-window'

// Helpers
export { createRedisStorage, createMemoryStorage } from './helpers'

// Middleware
export { expressMiddleware } from './middleware/express'
export type { ExpressMiddlewareOptions } from './middleware/express'
export { fastifyMiddleware } from './middleware/fastify'
