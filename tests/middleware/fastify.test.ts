import { describe, it, expect, vi, beforeEach, Mock } from 'vitest'
import type { FastifyRequest, FastifyReply } from 'fastify'
import { fastifyMiddleware } from '../../src/middleware/fastify'
import { RateLimiterInstance } from '../../src/core/rate-limiter'
import { RateLimiterResult } from '../../src/core/strategy'

describe('Fastify Middleware', () => {
    let mockReq: Partial<FastifyRequest>
    let mockReply: Partial<FastifyReply>
    let mockLimiterInstance: RateLimiterInstance

    beforeEach(() => {
        vi.clearAllMocks()

        mockReq = {
            ip: '127.0.0.1',
        }

        mockReply = {
            status: vi.fn().mockReturnThis(),
            send: vi.fn().mockReturnThis(),
        }

        mockLimiterInstance = {
            consume: vi.fn(),
        }
    })

    it('should proceed to the next handler if the request is allowed', async () => {
        const result: RateLimiterResult = { allowed: true }
        ;(mockLimiterInstance.consume as Mock).mockResolvedValue(result)
        const middleware = fastifyMiddleware(mockLimiterInstance)

        await middleware(mockReq as FastifyRequest, mockReply as FastifyReply)

        expect(mockLimiterInstance.consume).toHaveBeenCalledWith('127.0.0.1')
        expect(mockReply.status).not.toHaveBeenCalled()
        expect(mockReply.send).not.toHaveBeenCalled()
    })

    it('should send a 429 response if the request is denied', async () => {
        const now = Date.now()
        const result: RateLimiterResult = {
            allowed: false,
            reset: now + 5000,
        }
        ;(mockLimiterInstance.consume as Mock).mockResolvedValue(result)
        const middleware = fastifyMiddleware(mockLimiterInstance)

        await middleware(mockReq as FastifyRequest, mockReply as FastifyReply)

        expect(mockLimiterInstance.consume).toHaveBeenCalledWith('127.0.0.1')
        expect(mockReply.status).toHaveBeenCalledWith(429)
        expect(mockReply.send).toHaveBeenCalledWith({
            error: 'Too many requests',
            retryAfter: expect.any(Number),
        })

        const sendCallArg = (mockReply.send as Mock).mock.calls[0][0]
        expect(sendCallArg.retryAfter).toBeGreaterThanOrEqual(4900)
        expect(sendCallArg.retryAfter).toBeLessThanOrEqual(5000)
    })

    it('should not include retryAfter if reset is not available', async () => {
        const result: RateLimiterResult = { allowed: false } // No reset
        ;(mockLimiterInstance.consume as Mock).mockResolvedValue(result)
        const middleware = fastifyMiddleware(mockLimiterInstance)

        await middleware(mockReq as FastifyRequest, mockReply as FastifyReply)

        expect(mockReply.status).toHaveBeenCalledWith(429)
        expect(mockReply.send).toHaveBeenCalledWith({
            error: 'Too many requests',
        })
    })
})
