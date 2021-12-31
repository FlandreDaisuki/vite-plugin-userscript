import { defineConfig } from 'vite';
import { metablock } from '../..';

const name = 'vite-metablock-basic-example';

export default defineConfig({
  plugins: [
    metablock(),
  ],
  build: {
    minify: false,
    lib: {
      entry: 'index.js',
      name,
    },
    rollupOptions: {
      // multiple outputs
      // ref: https://github.com/vitejs/vite/discussions/1736
      output: ['iife', 'umd'].map((format) => ({
        extend: true,
        format,
        entryFileNames: `${name}-${format}.user.js`,
      })),
    },
  },
});
