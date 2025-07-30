import { describe, it, expect, vi, beforeEach, Mock } from 'vitest'
import type { Request, Response, NextFunction } from 'express'
import { expressMiddleware } from '../../src/middleware/express'
import { RateLimiter } from '../../src/core/rate-limiter'
import { RateLimiterResult } from '../../src/core/strategy'

// Mock the entire RateLimiter class to control its instances
vi.mock('../../src/core/rate-limiter')

describe('Express Middleware', () => {
    let mockReq: Partial<Request>
    let mockRes: Partial<Response>
    let mockNext: NextFunction
    let mockLimiterInstance: RateLimiter

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

        // Create a mock instance that satisfies the RateLimiter type for the test
        mockLimiterInstance = {
            isAllowed: vi.fn(),
        } as unknown as RateLimiter
    })

    it('should call next() if the request is allowed', async () => {
        // Arrange
        ;(mockLimiterInstance.isAllowed as Mock).mockResolvedValue({
            allowed: true,
            remaining: 9,
            reset: 0,
        })
        const middleware = expressMiddleware({ limiter: mockLimiterInstance })

        // Act
        await middleware(mockReq as Request, mockRes as Response, mockNext)

        // Assert
        expect(mockLimiterInstance.isAllowed).toHaveBeenCalledWith('127.0.0.1')
        expect(mockNext).toHaveBeenCalledTimes(1)
        expect(mockRes.status).not.toHaveBeenCalled()
    })

    it('should send a 429 response if the request is denied', async () => {
        // Arrange
        const resetTime = Date.now() + 1000 * 60
        const result: RateLimiterResult = {
            allowed: false,
            remaining: 0,
            reset: resetTime,
        }
        ;(mockLimiterInstance.isAllowed as Mock).mockResolvedValue(result)
        const middleware = expressMiddleware({ limiter: mockLimiterInstance })

        // Act
        await middleware(mockReq as Request, mockRes as Response, mockNext)

        // Assert
        expect(mockNext).not.toHaveBeenCalled()
        expect(mockRes.status).toHaveBeenCalledWith(429)
        expect(mockRes.send).toHaveBeenCalledWith('Too Many Requests')
        expect(mockRes.setHeader).toHaveBeenCalledWith('Retry-After', '60')
    })

    it('should use a custom identifier function if provided', async () => {
        // Arrange
        ;(mockLimiterInstance.isAllowed as Mock).mockResolvedValue({
            allowed: true,
            remaining: 9,
            reset: 0,
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
        expect(mockLimiterInstance.isAllowed).toHaveBeenCalledWith('user-123')
        expect(mockNext).toHaveBeenCalledTimes(1)
    })

    it('should call a custom onDeny function if provided', async () => {
        // Arrange
        const onDeny = vi.fn()
        const result: RateLimiterResult = {
            allowed: false,
            remaining: 0,
            reset: Date.now(),
        }
        ;(mockLimiterInstance.isAllowed as Mock).mockResolvedValue(result)
        const middleware = expressMiddleware({
            limiter: mockLimiterInstance,
            onDeny,
        })

        // Act
        await middleware(mockReq as Request, mockRes as Response, mockNext)

        // Assert
        expect(onDeny).toHaveBeenCalledWith(result, mockReq, mockRes, mockNext)
        expect(mockRes.status).not.toHaveBeenCalled() // onDeny is now responsible for the response
        expect(mockNext).not.toHaveBeenCalled()
    })
})
