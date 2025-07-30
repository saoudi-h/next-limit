import { RateLimiter } from '../core/rate-limiter'
import { Request, Response, NextFunction } from 'express'

export const expressMiddleware = (limiter: RateLimiter) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        const result = await limiter.isAllowed(req.ip || '')
        if (!result.allowed) {
            return res.status(429).json({
                error: 'Too many requests',
                retryAfter: result.reset - Date.now(),
            })
        }
        next()
    }
}
