/**
 * @file Provides a middleware (hook) for the Fastify web framework.
 */

import { RateLimiter } from '../core/rate-limiter'
import { FastifyRequest, FastifyReply } from 'fastify'

/**
 * Creates a rate limiting hook for Fastify applications.
 *
 * This function is a factory that takes a `RateLimiter` instance and returns
 * a Fastify `preHandler` hook. The hook automatically uses the request's IP address
 * (`request.ip`) as the identifier for rate limiting.
 *
 * @param limiter An instance of the `RateLimiter` configured with the desired strategy and limits.
 * @returns A Fastify `preHandler` hook function.
 *
 * @example
 * ```typescript
 * import fastify from 'fastify';
 * import { RateLimiter } from 'next-limit';
 * import { fastifyMiddleware } from 'next-limit/middleware';
 * import { MemoryStorageAdapter } from 'next-limit/storage';
 *
 * const app = fastify();
 *
 * const limiter = new RateLimiter({
 *   storage: new MemoryStorageAdapter(),
 *   windowMs: 60 * 1000, // 1 minute
 *   limit: 100, // 100 requests per minute
 * });
 *
 * app.addHook('preHandler', fastifyMiddleware(limiter));
 *
 * app.get('/', (request, reply) => {
 *   reply.send('Hello, world!');
 * });
 * ```
 */
export const fastifyMiddleware = (limiter: RateLimiter) => {
    /**
     * The actual hook function applied to incoming requests.
     * @param request The Fastify request object.
     * @param reply The Fastify reply object.
     */
    return async (request: FastifyRequest, reply: FastifyReply) => {
        // Use the request's IP address as the identifier.
        const result = await limiter.isAllowed(request.ip)

        // If the request is not allowed, send a 429 Too Many Requests response.
        // The `return` statement prevents further handlers from being executed.
        if (!result.allowed) {
            reply.status(429).send({
                error: 'Too many requests',
                // Calculate the time remaining until reset in milliseconds.
                retryAfter: result.reset - Date.now(),
            })
            return
        }

        // If the request is allowed, the hook completes without sending a response,
        // allowing Fastify to proceed to the next handler.
    }
}
