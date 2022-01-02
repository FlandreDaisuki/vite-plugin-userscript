# vite-plugin-userscript

## Get Started

```sh
npm i -D vite-plugin-userscript
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

## Examples

See [examples](https://github.com/FlandreDaisuki/vite-plugin-userscript/tree/master/examples) folder

## License

[MIT](LICENSE)
