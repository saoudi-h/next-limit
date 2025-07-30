import { defineConfig } from 'tsup';

export default defineConfig(({watch})=>({
  entry: ['src/index.ts'],
  treeshake: true,
  format: ['cjs', 'esm'],
  dts: true,
  target: 'esnext',
  splitting: true,
  sourcemap: true,
  minify: !watch,
  clean: true,
}));
