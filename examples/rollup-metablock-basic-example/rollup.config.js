import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import { terser } from 'rollup-plugin-terser';
import { metablock } from 'vite-plugin-userscript';

// `npm run build` -> `production` is true
// `npm run dev` -> `production` is false
const production = !process.env.ROLLUP_WATCH;

const plugins = [
  resolve(),
  commonjs(),
  production && terser(),
  metablock(),
];

const name = 'rollup-metablock-basic-example';

export default ['iife', 'umd'].map((format) => ({
  input: 'index.js',
  output: {
    file: `dist/${name}-${format}.user.js`,
    format,
  },
  plugins,
}));
