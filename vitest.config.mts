import { defineConfig } from 'vitest/config'
import { config } from 'dotenv'

config({ path: '.env.test' })

export default defineConfig({
    test: {
        globals: true,
        environment: 'node',
        include: ['tests/**/*.{test,spec}.ts'],
        exclude: ['**/node_modules/**', '**/dist/**', '**/build/**'],
        coverage: {
            enabled: true,
            provider: 'v8',
            reporter: ['text', 'json', 'html'],
            include: ['src/**/*.ts'],
            exclude: [
                'src/**/*.{test,spec}.{ts,tsx}',
                'src/**/*.d.ts',
                'src/core/storage.ts',
                'src/core/strategy.ts',
                'release.config.mjs',
                'vitest.config.mts',
                'tsup.config.ts',
                'eslint.config.mjs',
                'prettier.config.mjs',
                'typedoc.json',
                'src/scripts/sliding-window.lua',
                'src/index.ts',
                'node_modules/**',
                'dist/**',
                'build/**',
                'coverage/**',
                'docs/**',
            ],
        },
    },
})
