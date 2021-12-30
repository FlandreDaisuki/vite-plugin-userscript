import { defineConfig } from 'tsup';

export default defineConfig({
  splitting: false,
  sourcemap: false,
  clean: true,
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  dts: true,
});
