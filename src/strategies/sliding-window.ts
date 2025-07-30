import { StorageAdapter } from '../core/storage'
import { RateLimitStrategy, RateLimiterResult } from '../core/strategy'
import * as fs from 'fs'
import * as path from 'path'

export class SlidingWindowStrategy implements RateLimitStrategy {
    private scriptSha: string | null = null

    constructor(
        private readonly storage: StorageAdapter,
        private readonly windowMs: number,
        private readonly _limit: number,
        private readonly prefix: string
    ) {}

    private async loadScript(): Promise<string> {
        if (this.scriptSha) {
            return this.scriptSha
        }

        const scriptPath = path.join(__dirname, '../scripts/sliding-window.lua')
        const script = fs.readFileSync(scriptPath, 'utf8')
        this.scriptSha = await this.storage.scriptLoad(script)
        return this.scriptSha
    }

    async limit(identifier: string): Promise<RateLimiterResult> {
        const key = `${this.prefix}:sliding-window:${identifier}`
        const now = Date.now()

        const scriptSha = await this.loadScript()

        const result = (await this.storage.evalSha(
            scriptSha,
            [key],
            [now.toString(), this.windowMs.toString(), this._limit.toString()]
        )) as [boolean, number, number]

        return {
            allowed: result[0],
            remaining: result[1],
            reset: result[2],
        }
    }
}
