import { RedisClientType } from 'redis'
import { StorageAdapter } from './storage'

type RedisMultiExecResult = [number, string]

export class RedisStorageAdapter implements StorageAdapter {
    constructor(private readonly redis: RedisClientType) {}

    async increment(
        key: string,
        windowMs: number
    ): Promise<{ count: number; ttl: number }> {
        const multi = this.redis.multi()
        multi.incr(key)
        multi.pExpire(key, windowMs)
        const [count] = (await multi.exec()) as unknown as RedisMultiExecResult
        return { count, ttl: windowMs }
    }

    async evalSha(
        sha: string,
        keys: string[],
        args: string[]
    ): Promise<[boolean, number, number]> {
        return this.redis.evalSha(sha, { keys, arguments: args }) as Promise<
            [boolean, number, number]
        >
    }

    async scriptLoad(script: string): Promise<string> {
        return this.redis.scriptLoad(script)
    }
}
