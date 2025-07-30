export interface StorageAdapter {
    increment(
        key: string,
        windowMs: number
    ): Promise<{ count: number; ttl: number }>
    evalSha(
        sha: string,
        keys: string[],
        args: string[]
    ): Promise<[boolean, number, number]>
    scriptLoad(script: string): Promise<string>
}
