# vite-plugin-userscript

## Get Started

```sh
pnpm i -D vite-plugin-userscript
```

```js
// vite.config.js

import { defineConfig } from 'vite';
import { metablock } from 'vite-plugin-userscript';

export default defineConfig({
  plugins: [
    metablock(),
  ],
  build: {
    lib: {
      entry: 'index.js',
      name: 'my-awesome-userscript',
    },
    rollupOptions: {
      output: {
        extend: true,
        format: 'umd',
        entryFileNames: 'my-awesome-userscript.user.js',
      },
    },
  },
});
```

Full options

```js

metablock({
  // support json / json5 / yaml.
  file: './metablock.json',

  // show hints if you only want to write for specific script manager.
  manager: 'all',

  // dynamic override the meta from meta file
  override: {
    name: require('package.json').name
  },

  order: ['name', 'description', 'namespace', '...', 'grant'],

  // the action when meet invalid meta
  errorLevel: 'warn'

  // append metablock to which output files
  applyTo: /[.]user[.]js$/
})

```

## Examples

See [examples](https://github.com/FlandreDaisuki/vite-plugin-userscript/tree/master/examples) folder

## License

[MIT](LICENSE)
