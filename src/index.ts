/**
 * Entry point for the next-limit package.
 * This file exports the public API for creating and using rate limiters.
 */

// --- Main Factory ---
export { createRateLimiter } from './factories'
export type { RateLimiterConfig } from './factories'

// --- Strategy Factories ---
export {
    createFixedWindowStrategy,
    createSlidingWindowStrategy,
} from './factories'
export type { WindowOptions } from './factories'

// --- Storage Factories ---
export { createRedisStorage, createMemoryStorage } from './factories'
export type { AutoRedisConfig } from './factories'

// --- Core Types ---
// Rate limiter types
export type { RateLimiterInstance } from './core/rate-limiter'

// Strategy types
export type {
    RateLimiterResult,
    RateLimitStrategy,
    StrategyFactory,
    FixedWindowStrategy,
    SlidingWindowStrategy,
} from './core/strategy'

// Storage types
export type {
    Storage,
    RedisStorage,
    RedisStorageOptions,
    StoragePipeline,
} from './core/storage'

export type { RedisLike, RedisMultiLike } from './types/redis'

// --- Middleware ---
export { expressMiddleware } from './middleware/express'
export type { ExpressMiddlewareOptions } from './middleware/express'
export { fastifyMiddleware } from './middleware/fastify'
