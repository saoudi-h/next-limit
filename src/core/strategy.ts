/**
 * @file Defines the core interfaces and implementations for rate limiting strategies.
 */

import { RedisClientType } from 'redis'
import { slidingWindow } from '../scripts'
import { RedisStorage, Storage } from './storage'

/**
 * Represents the result of a rate limit check.
 */
export interface RateLimiterResult {
    allowed: boolean
    limit: number
    remaining: number
    reset: number
}

/**
 * Defines the contract for a rate limiting strategy.
 */
export interface RateLimitStrategy {
    limit(identifier: string, storage: Storage): Promise<RateLimiterResult>
}

/**
 * Implements the Fixed Window rate limiting strategy using a generic storage backend.
 */
export class FixedWindowStrategy implements RateLimitStrategy {
    constructor(
        private windowMs: number,
        private requestLimit: number,
        private prefix: string
    ) {}

    async limit(
        identifier: string,
        storage: Storage
    ): Promise<RateLimiterResult> {
        const key = `${this.prefix}:fixed-window:${identifier}`
        const now = Date.now()

        const count = await storage.increment(key, this.windowMs)
        const allowed = count <= this.requestLimit
        const remaining = allowed ? this.requestLimit - count : 0

        return {
            allowed,
            limit: this.requestLimit,
            remaining: Math.max(0, remaining),
            reset: now + this.windowMs,
        }
    }
}

/**
 * Implements the Sliding Window rate limiting strategy using a generic storage backend.
 */
export class SlidingWindowStrategy implements RateLimitStrategy {
    constructor(
        private windowMs: number,
        private requestLimit: number,
        private prefix: string
    ) {}

    async limit(
        identifier: string,
        storage: Storage
    ): Promise<RateLimiterResult> {
        const key = `${this.prefix}:sliding-window:${identifier}`
        const now = Date.now()
        const random = Math.random().toString(36).slice(2)

        // If using Redis, leverage the optimized Lua script for atomicity.
        if (storage instanceof RedisStorage) {
            return this.limitWithLuaScript(key, now, random, storage)
        }

        // For other storage types (like in-memory), perform operations sequentially.
        // This is acceptable for single-threaded environments like Node.js.
        const windowStart = now - this.windowMs
        await storage.zRemoveRangeByScore(key, 0, windowStart)
        const currentRequests = await storage.zCount(key)

        if (currentRequests >= this.requestLimit) {
            const oldestRequests = await storage.zRangeWithScores(key, 0, 0)
            const resetTime = (oldestRequests[0]?.score || now) + this.windowMs
            return {
                allowed: false,
                remaining: 0,
                reset: resetTime,
                limit: this.requestLimit,
            }
        }

        await storage.zAdd(key, now, `${now}:${random}`)
        await storage.expire(key, this.windowMs)

        const remaining = this.requestLimit - (currentRequests + 1)
        const oldestRequests = await storage.zRangeWithScores(key, 0, 0)
        const resetTime = (oldestRequests[0]?.score || now) + this.windowMs

        return {
            allowed: true,
            remaining,
            reset: resetTime,
            limit: this.requestLimit,
        }
    }

    private async limitWithLuaScript(
        key: string,
        now: number,
        random: string,
        storage: Storage
    ): Promise<RateLimiterResult> {
        // The RedisStorage instance is cast to `any` to access the private `redis` property.
        // This is a controlled way to access the underlying client for script execution.
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const redis = (storage as any).redis as RedisClientType
        const rawResult = await redis.eval(slidingWindow, {
            keys: [key],
            arguments: [
                now.toString(),
                this.windowMs.toString(),
                this.requestLimit.toString(),
                random,
            ],
        })

        const [allowed, remaining, reset] = rawResult as [
            number,
            number,
            number,
        ]
        return {
            allowed: Boolean(allowed),
            remaining,
            reset,
            limit: this.requestLimit,
        }
    }
}
