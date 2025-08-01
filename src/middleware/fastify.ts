/**
 * @file Provides a middleware (hook) for the Fastify web framework.
 */

import { RateLimiterInstance } from '../core/rate-limiter'
import { FastifyRequest, FastifyReply } from 'fastify'

/**
 * Creates a rate limiting hook for Fastify applications.
 *
 * This function is a factory that takes a `RateLimiterInstance` and returns
 * a Fastify `preHandler` hook. The hook automatically uses the request's IP address
 * (`request.ip`) as the identifier for rate limiting.
 *
 * @param limiter An instance of the `RateLimiterInstance` created with `createRateLimiter`.
 * @returns A Fastify `preHandler` hook function.
 *
 * @example
 * ```typescript
 * import fastify from 'fastify';
 * import {
 *   createRateLimiter,
 *   createMemoryStorage,
 *   createFixedWindowStrategy,
 *   fastifyMiddleware
 * } from 'next-limit';
 *
 * const app = fastify();
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
 * app.addHook('preHandler', fastifyMiddleware(limiter));
 *
 * app.get('/', (request, reply) => {
 *   reply.send('Hello, world!');
 * });
 * ```
 */
export const fastifyMiddleware = (limiter: RateLimiterInstance) => {
    /**
     * The actual hook function applied to incoming requests.
     * @param request The Fastify request object.
     * @param reply The Fastify reply object.
     */
    return async (request: FastifyRequest, reply: FastifyReply) => {
        // Use the request's IP address as the identifier.
        const result = await limiter.consume(request.ip)

        // If the request is not allowed, send a 429 Too Many Requests response.
        // The `return` statement prevents further handlers from being executed.
        if (!result.allowed) {
            const response: { error: string; retryAfter?: number } = {
                error: 'Too many requests',
            }

            // Only include retryAfter if the reset time is available.
            if (result.reset) {
                const retryAfterMs = result.reset - Date.now()
                if (retryAfterMs > 0) {
                    response.retryAfter = retryAfterMs
                }
            }

            reply.status(429).send(response)
            return
        }

        // If the request is allowed, the hook completes without sending a response,
        // allowing Fastify to proceed to the next handler.
    }
}
