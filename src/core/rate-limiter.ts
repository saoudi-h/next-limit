import { StorageAdapter } from './storage'
import { FixedWindowStrategy } from '../strategies/fixed-window'
import { SlidingWindowStrategy } from '../strategies/sliding-window'
import { RateLimiterResult, RateLimitStrategy } from './strategy'

export interface RateLimiterOptions {
    storage: StorageAdapter
    strategy?: 'sliding-window' | 'fixed-window'
    windowMs: number
    limit: number
    prefix?: string
    onError?: 'allow' | 'deny' | 'throw'
}

export class RateLimiter {
    private readonly strategy: RateLimitStrategy
    private readonly onError: 'allow' | 'deny' | 'throw'

    constructor(options: RateLimiterOptions) {
        this.onError = options.onError ?? 'deny'

        switch (options.strategy) {
            case 'fixed-window':
                this.strategy = new FixedWindowStrategy(
                    options.storage,
                    options.windowMs,
                    options.limit,
                    options.prefix ?? 'ratelimit'
                )
                break
            case 'sliding-window':
            default:
                this.strategy = new SlidingWindowStrategy(
                    options.storage,
                    options.windowMs,
                    options.limit,
                    options.prefix ?? 'ratelimit'
                )
                break
        }
    }

    private async handleRedisError<T>(
        promise: Promise<T>
    ): Promise<T | RateLimiterResult> {
        try {
            return await promise
        } catch (error) {
            console.error('Storage error:', error)
            switch (this.onError) {
                case 'allow':
                    return { allowed: true, remaining: 0, reset: 0 }
                case 'throw':
                    throw error
                case 'deny':
                default:
                    return { allowed: false, remaining: 0, reset: 0 }
            }
        }
    }

    async hit(identifier: string): Promise<RateLimiterResult> {
        return this.handleRedisError(
            this.strategy.limit(identifier)
        ) as Promise<RateLimiterResult>
    }

    async isAllowed(identifier: string): Promise<RateLimiterResult> {
        return this.hit(identifier)
    }
}
