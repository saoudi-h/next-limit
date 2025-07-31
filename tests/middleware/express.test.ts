import { describe, it, expect, vi, beforeEach, Mock } from 'vitest'
import type { Request, Response, NextFunction } from 'express'
import { expressMiddleware } from '../../src/middleware/express'
import { RateLimiterInstance } from '../../src/core/rate-limiter'
import { RateLimiterResult } from '../../src/core/strategy'

describe('Express Middleware', () => {
    let mockReq: Partial<Request>
    let mockRes: Partial<Response>
    let mockNext: NextFunction
    let mockLimiterInstance: RateLimiterInstance

    beforeEach(() => {
        // Reset mocks before each test
        vi.clearAllMocks()

        mockReq = {
            ip: '127.0.0.1',
        }

        mockRes = {
            status: vi.fn().mockReturnThis(),
            send: vi.fn().mockReturnThis(),
            setHeader: vi.fn().mockReturnThis(),
        }

        mockNext = vi.fn()

        // Create a mock instance that satisfies the RateLimiterInstance type
        mockLimiterInstance = {
            consume: vi.fn(),
        }
    })

    it('should call next() if the request is allowed', async () => {
        // Arrange
        ;(mockLimiterInstance.consume as Mock).mockResolvedValue({
            allowed: true,
        })
        const middleware = expressMiddleware({ limiter: mockLimiterInstance })

        // Act
        await middleware(mockReq as Request, mockRes as Response, mockNext)

        // Assert
        expect(mockLimiterInstance.consume).toHaveBeenCalledWith('127.0.0.1')
        expect(mockNext).toHaveBeenCalledTimes(1)
        expect(mockRes.status).not.toHaveBeenCalled()
    })

    it('should send a 429 response and set all headers if the request is denied', async () => {
        // Arrange
        const resetTime = Date.now() + 60000
        const result: RateLimiterResult = {
            allowed: false,
            reset: resetTime,
            limit: 10,
            remaining: 0,
        }
        ;(mockLimiterInstance.consume as Mock).mockResolvedValue(result)
        const middleware = expressMiddleware({ limiter: mockLimiterInstance })

        // Act
        await middleware(mockReq as Request, mockRes as Response, mockNext)

        // Assert
        expect(mockNext).not.toHaveBeenCalled()
        expect(mockRes.setHeader).toHaveBeenCalledWith(
            'X-RateLimit-Limit',
            '10'
        )
        expect(mockRes.setHeader).toHaveBeenCalledWith(
            'X-RateLimit-Remaining',
            '0'
        )
        expect(mockRes.setHeader).toHaveBeenCalledWith('Retry-After', '60')
        expect(mockRes.status).toHaveBeenCalledWith(429)
        expect(mockRes.send).toHaveBeenCalledWith('Too Many Requests')
    })

    it('should not set Retry-After header if reset is not available', async () => {
        // Arrange
        const result: RateLimiterResult = { allowed: false } // No reset time
        ;(mockLimiterInstance.consume as Mock).mockResolvedValue(result)
        const middleware = expressMiddleware({ limiter: mockLimiterInstance })

        // Act
        await middleware(mockReq as Request, mockRes as Response, mockNext)

        // Assert
        expect(mockRes.setHeader).not.toHaveBeenCalledWith(
            'Retry-After',
            expect.anything()
        )
        expect(mockRes.status).toHaveBeenCalledWith(429)
    })

    it('should use a custom identifier function if provided', async () => {
        // Arrange
        ;(mockLimiterInstance.consume as Mock).mockResolvedValue({
            allowed: true,
        })
        mockReq.headers = { 'x-user-id': 'user-123' }
        const identifier = (req: Request) => req.headers['x-user-id'] as string
        const middleware = expressMiddleware({
            limiter: mockLimiterInstance,
            identifier,
        })

        // Act
        await middleware(mockReq as Request, mockRes as Response, mockNext)

        // Assert
        expect(mockLimiterInstance.consume).toHaveBeenCalledWith('user-123')
        expect(mockNext).toHaveBeenCalledTimes(1)
    })

    it('should call a custom onDeny function if provided', async () => {
        // Arrange
        const onDeny = vi.fn()
        const result: RateLimiterResult = { allowed: false }
        ;(mockLimiterInstance.consume as Mock).mockResolvedValue(result)
        const middleware = expressMiddleware({
            limiter: mockLimiterInstance,
            onDeny,
        })

        // Act
        await middleware(mockReq as Request, mockRes as Response, mockNext)

        // Assert
        expect(onDeny).toHaveBeenCalledWith(result, mockReq, mockRes, mockNext)
        expect(mockRes.status).not.toHaveBeenCalled() // onDeny is now responsible
        expect(mockNext).not.toHaveBeenCalled()
    })
})
