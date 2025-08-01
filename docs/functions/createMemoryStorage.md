[**next-limit**](../README.md)

***

[next-limit](../README.md) / createMemoryStorage

# Function: createMemoryStorage()

> **createMemoryStorage**(): `Storage`

Defined in: [factories.ts:267](https://github.com/saoudi-h/next-limit/blob/45012419e7c26986c08104835525b0ea21d24a3f/src/factories.ts#L267)

Creates a `MemoryStorage` instance.
Useful for testing or single-process applications.

This function creates a new MemoryStorage instance that uses an in-memory Map as the storage backend.
It's ideal for testing and development environments where you don't need to persist rate limiting
state or share it across multiple application instances.

## Returns

`Storage`

A configured instance of `MemoryStorage`.

## Example

```typescript
const storage = createMemoryStorage();
```
