/**
 * Entry point for the next-limit package.
 * This file exports the public API for creating and using rate limiters.
 */

// --- Main Factory ---
export { createRateLimiter } from './factories'
export type { CreateRateLimiterOptions } from './factories'

// --- Strategy Factories ---
export {
    createFixedWindowStrategy,
    createSlidingWindowStrategy,
} from './factories'
export type {
    FixedWindowStrategyConfig,
    SlidingWindowStrategyConfig,
} from './factories'

// --- Storage Factories ---
export { createRedisStorage, createMemoryStorage } from './factories'

// --- Core Types ---
export type { RateLimiterInstance } from './core/rate-limiter'
export type { RateLimiterResult, RateLimitStrategy } from './core/strategy'

// --- Middleware ---
// Note: Middlewares may need to be updated to align with the new factory-based API.
export { expressMiddleware } from './middleware/express'
export type { ExpressMiddlewareOptions } from './middleware/express'
export { fastifyMiddleware } from './middleware/fastify'
