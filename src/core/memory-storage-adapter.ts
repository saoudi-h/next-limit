import { StorageAdapter } from './storage'

export class MemoryStorageAdapter implements StorageAdapter {
    private readonly store = new Map<
        string,
        { value: number; expiresAt: number }
    >()

    async increment(
        key: string,
        windowMs: number
    ): Promise<{ count: number; ttl: number }> {
        const now = Date.now()
        const current = this.store.get(key)

        if (current && current.expiresAt < now) {
            this.store.delete(key)
        }

        const newValue = (current?.value ?? 0) + 1
        this.store.set(key, { value: newValue, expiresAt: now + windowMs })

        return { count: newValue, ttl: windowMs }
    }

    // The memory storage adapter does not support Lua scripts, so these methods will throw an error.
    async evalSha(
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        sha: string,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        keys: string[],
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        args: string[]
    ): Promise<[boolean, number, number]> {
        throw new Error(
            'Lua scripts are not supported by the memory storage adapter.'
        )
    }

    async scriptLoad(
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        script: string
    ): Promise<string> {
        throw new Error(
            'Lua scripts are not supported by the memory storage adapter.'
        )
    }
}
