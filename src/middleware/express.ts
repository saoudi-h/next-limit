/**
 * @file Provides a middleware for the Express web framework.
 */

import { RateLimiterInstance } from '../core/rate-limiter'
import { Request, Response, NextFunction } from 'express'
import { RateLimiterResult } from '../core/strategy'

/**
 * Configuration options for the Express middleware.
 */
export interface ExpressMiddlewareOptions {
    /**
     * The `RateLimiterInstance` to use for checking requests.
     * This should be created using the `createRateLimiter` factory.
     */
    limiter: RateLimiterInstance
    /**
     * A function to generate a unique identifier for a request.
     * Defaults to using `req.ip`.
     * @param req The Express request object.
     * @returns A string identifier.
     */
    identifier?: (req: Request) => string
    /**
     * A function to execute when a request is denied.
     * If not provided, a default 429 response is sent.
     * @param result The result from the rate limiter.
     * @param req The Express request object.
     * @param res The Express response object.
     * @param next The Express next function.
     */
    onDeny?: (
        result: RateLimiterResult,
        req: Request,
        res: Response,
        next: NextFunction
    ) => void
}

/**
 * Creates a rate limiting middleware for Express applications.
 *
 * This function creates an Express middleware that uses a RateLimiterInstance
 * to check if requests are allowed based on the configured rate limiting strategy.
 * It automatically sets rate limit headers and handles denied requests.
 *
 * @param options The middleware configuration options.
 * @param options.limiter The `RateLimiterInstance` to use for checking requests.
 * @param options.identifier A function to generate a unique identifier for a request.
 * @param options.onDeny A function to execute when a request is denied.
 * @returns An Express middleware function.
 *
 * @example
 * ```typescript
 * import express from 'express';
 * import {
 *   createRateLimiter,
 *   createMemoryStorage,
 *   createFixedWindowStrategy,
 *   expressMiddleware
 * } from 'next-limit';
 *
 * const app = express();
 *
 * const storage = createMemoryStorage();
 * const strategyFactory = createFixedWindowStrategy({
 *   windowMs: 60000, // 1 minute
 *   limit: 100,      // 100 requests per minute
 * });
 *
 * const limiter = createRateLimiter({
 *   strategy: strategyFactory,
 *   storage: storage
 * });
 *
 * app.use(expressMiddleware({
 *   limiter: limiter,
 *   identifier: (req) => req.ip ?? ''
 * }));
 *
 * app.get('/', (req, res) => {
 *   res.send('Hello, world!');
 * });
 * ```
 */
export const expressMiddleware = (options: ExpressMiddlewareOptions) => {
    const { limiter, identifier, onDeny } = options

    return async (req: Request, res: Response, next: NextFunction) => {
        const clientId = identifier ? identifier(req) : (req.ip ?? '')
        const result = await limiter.consume(clientId)

        // Set rate limit headers
        if (result.limit) {
            res.setHeader('X-RateLimit-Limit', String(result.limit))
        }
        if (typeof result.remaining === 'number') {
            res.setHeader('X-RateLimit-Remaining', String(result.remaining))
        }

        if (result.allowed) {
            return next()
        }

        if (onDeny) {
            onDeny(result, req, res, next)
        } else {
            // Only set the Retry-After header if the reset time is available.
            if (result.reset) {
                const retryAfterSeconds = Math.ceil(
                    (result.reset - Date.now()) / 1000
                )
                if (retryAfterSeconds > 0) {
                    res.setHeader('Retry-After', String(retryAfterSeconds))
                }
            }
            res.status(429).send('Too Many Requests')
        }
    }
}
