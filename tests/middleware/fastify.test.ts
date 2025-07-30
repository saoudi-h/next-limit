import { describe, it, expect, vi, beforeEach, Mock } from 'vitest'
import type { FastifyRequest, FastifyReply } from 'fastify'
import { fastifyMiddleware } from '../../src/middleware/fastify'
import { RateLimiter } from '../../src/core/rate-limiter'
import { RateLimiterResult } from '../../src/core/strategy'

// Mock the entire RateLimiter class to control its instances
vi.mock('../../src/core/rate-limiter')

describe('Fastify Middleware', () => {
    let mockReq: Partial<FastifyRequest>
    let mockReply: Partial<FastifyReply>
    let mockLimiterInstance: RateLimiter

    beforeEach(() => {
        // Reset mocks before each test
        vi.clearAllMocks()

        mockReq = {
            ip: '127.0.0.1',
        }

        // Mock the reply object with chainable methods
        mockReply = {
            status: vi.fn().mockReturnThis(),
            send: vi.fn().mockReturnThis(),
        }

        // Create a mock instance of the RateLimiter
        // The actual constructor logic is mocked, so we can pass a dummy object.
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        mockLimiterInstance = new RateLimiter({} as any)
    })

    it('should proceed to the next handler if the request is allowed', async () => {
        // Arrange
        const result: RateLimiterResult = {
            allowed: true,
            remaining: 9,
            reset: Date.now(),
        }
        ;(mockLimiterInstance.isAllowed as Mock).mockResolvedValue(result)
        const middleware = fastifyMiddleware(mockLimiterInstance)

        // Act
        await middleware(mockReq as FastifyRequest, mockReply as FastifyReply)

        // Assert
        expect(mockLimiterInstance.isAllowed).toHaveBeenCalledWith('127.0.0.1')
        expect(mockReply.status).not.toHaveBeenCalled()
        expect(mockReply.send).not.toHaveBeenCalled()
    })

    it('should send a 429 response if the request is denied', async () => {
        // Arrange
        const now = Date.now()
        const result: RateLimiterResult = {
            allowed: false,
            remaining: 0,
            reset: now + 5000,
        }
        ;(mockLimiterInstance.isAllowed as Mock).mockResolvedValue(result)
        const middleware = fastifyMiddleware(mockLimiterInstance)

        // Act
        await middleware(mockReq as FastifyRequest, mockReply as FastifyReply)

        // Assert
        expect(mockLimiterInstance.isAllowed).toHaveBeenCalledWith('127.0.0.1')
        expect(mockReply.status).toHaveBeenCalledWith(429)
        expect(mockReply.send).toHaveBeenCalledWith({
            error: 'Too many requests',
            retryAfter: expect.any(Number),
        })

        // Check the retryAfter value more precisely
        const sendCallArg = (mockReply.send as Mock).mock.calls[0][0]
        expect(sendCallArg.retryAfter).toBeGreaterThanOrEqual(4900)
        expect(sendCallArg.retryAfter).toBeLessThanOrEqual(5000)
    })
})
