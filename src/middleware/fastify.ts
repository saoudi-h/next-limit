import { RateLimiter } from '../core/rate-limiter'
import { FastifyRequest, FastifyReply } from 'fastify'

export const fastifyMiddleware = (limiter: RateLimiter) => {
    return async (request: FastifyRequest, reply: FastifyReply) => {
        const result = await limiter.isAllowed(request.ip)
        if (!result.allowed) {
            return reply.status(429).send({
                error: 'Too many requests',
                retryAfter: result.reset - Date.now(),
            })
        }
    }
}
