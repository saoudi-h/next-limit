import { StorageAdapter } from '../core/storage'
import { RateLimitStrategy, RateLimiterResult } from '../core/strategy'

export class FixedWindowStrategy implements RateLimitStrategy {
    constructor(
        private readonly storage: StorageAdapter,
        private readonly windowMs: number,
        private readonly _limit: number,
        private readonly prefix: string
    ) {}

    async limit(identifier: string): Promise<RateLimiterResult> {
        const key = `${this.prefix}:fixed-window:${identifier}`
        const now = Date.now()

        const { count } = await this.storage.increment(key, this.windowMs)

        const remaining = this._limit - count
        const allowed = remaining >= 0

        return {
            allowed,
            remaining: Math.max(0, remaining),
            reset: now + this.windowMs,
        }
    }
}
