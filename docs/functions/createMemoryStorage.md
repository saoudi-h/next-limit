[**next-limit**](../README.md)

***

[next-limit](../README.md) / createMemoryStorage

# Function: createMemoryStorage()

> **createMemoryStorage**(): [`StorageAdapter`](../interfaces/StorageAdapter.md)

Defined in: [helpers.ts:41](https://github.com/saoudi-h/next-limit/blob/657cd4412856737cdc75b96e50f263c52d81c8f9/src/helpers.ts#L41)

Creates a new `MemoryStorageAdapter` instance.

## Returns

[`StorageAdapter`](../interfaces/StorageAdapter.md)

A new instance of `MemoryStorageAdapter`.

## Example

```typescript
import { createMemoryStorage } from 'next-limit';

const storage = createMemoryStorage();
```
