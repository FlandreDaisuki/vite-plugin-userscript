import type { Plugin } from 'vite';

import metablock from './metablock';

export { metablock };

// ref: https://github.com/vbenjs/vite-plugin-html
export default (options: Record<string, unknown> = {}): Plugin[] => {
  return [metablock(options)];
};
