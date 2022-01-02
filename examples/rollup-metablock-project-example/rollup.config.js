import { defineConfig } from 'rollup';
import commonjs from '@rollup/plugin-commonjs';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import { terser } from 'rollup-plugin-terser';

import { metablock } from 'vite-plugin-userscript';

export default defineConfig({
  input: 'src/main.js',
  output: {
    file: 'dist/out.user.js',
    format: 'umd',
    sourcemap: true,
  },
  plugins: [
    nodeResolve(),
    commonjs(),
    terser(),
    metablock({
      file: 'src/metablock.json',
      override: {
        version: '5.4.3',
      },
    }),
  ],
});
