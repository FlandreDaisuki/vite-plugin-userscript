import type { Plugin } from 'vite';

export interface MetablockPluginOption {
  // input options
  file?: string;
  matches?: string | RegExp | (string|RegExp)[];

  // output options
  override?: Record<string, string | Record<string, string>>;
  order?: string[];
  sourcemap?: boolean;
}


export default (options: MetablockPluginOption = {}): Plugin => {

  return {
    name: 'vite-plugin-userscript:metablock',

    // Use generateBundle instead of renderChunk hook because
    //   there are some magic remove comments after renderChunk
    // ref: https://rollupjs.org/guide/en/#output-generation-hooks
    generateBundle(_, bundle) {
      for (const outputChunk of Object.values(bundle)) {
        if (outputChunk.type === 'asset') {
          continue;
        }

        outputChunk.code = [
          '// ==UserScript==',
          '// ==/UserScript==',
          outputChunk.code,
        ].join('\n');
      }
    },
  };
};
