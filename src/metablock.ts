import type { Plugin } from 'vite';
import { createFilter } from '@rollup/pluginutils';

interface MetablockPluginOption {
  file?: string;
  include?: string[];
  exclude?: string[];
}

export default (options: MetablockPluginOption = {}): Plugin => {
  const filter = createFilter(options.include, options.exclude);

  return {
    name: 'vite-plugin-userscript:metablock',
    enforce: 'post',
    transform(code, id) {
      if (!filter(id)) { return; }

      return {
        code,
      };
    },
  };
};
