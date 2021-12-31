import type { Plugin } from 'vite';
import { isNil } from './util';

type MatchPattern = string | RegExp;

export interface MetablockPluginOption {
  // input options
  file?: string;

  // output options
  pattern?: MatchPattern | MatchPattern[];
  override?: Record<string, string | Record<string, string>>;
  order?: string[];
  sourcemap?: boolean;
}

const filenameFilter = (patterns: MatchPattern[]) => (filename: string): boolean => {
  return patterns.some((pattern) => {
    if (typeof pattern === 'string') {
      return filename.includes(pattern);
    } else {
      return pattern.test(filename);
    }
  });
};

export default (options: MetablockPluginOption = {}): Plugin => {

  const patterns = isNil(options.pattern)
    ? [/[.]user[.]js$/]
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    : ([] as MatchPattern[]).concat(options.pattern!);

  const filter = filenameFilter(patterns);

  return {
    name: 'vite-plugin-userscript:metablock',

    // Use generateBundle instead of renderChunk hook because
    //   there are some magic remove comments after renderChunk
    // ref: https://rollupjs.org/guide/en/#output-generation-hooks
    generateBundle(_, bundle) {
      for (const outputChunk of Object.values(bundle)) {
        if (outputChunk.type === 'asset') { continue; }

        const { code, fileName } = outputChunk;
        if (!filter(fileName)) { continue; }

        outputChunk.code = [
          '// ==UserScript==',
          '// ==/UserScript==',
          code,
        ].join('\n');
      }
    },
  };
};
