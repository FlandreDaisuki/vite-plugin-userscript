import type { Plugin } from 'vite';
import loadMetaFile from './file-loader';
import { META_ENTRIES_TRANSFORM_MAP } from './meta';
import { parsePluginOptions } from './options';
import { trim } from './utils';

const filenameFilter = (patterns: OutputApplyPattern[]) => (filename: string): boolean => {
  return patterns.some((pattern) => {
    if (typeof pattern === 'string') {
      return filename.includes(pattern);
    } else {
      return pattern.test(filename);
    }
  });
};

const validateErrorAction = (level: ErrorLevel) => (msg: string) => {
  if (level === 'warn') {
    return console.warn(msg);
  } else if (level === 'error') {
    throw new Error(msg);
  }
};

/**
 * flat multilingual name & description meta
 * flat unary / binary / ternary meta
 */
const transformToMetaEntries = (metablockInput: Record<string, unknown>, config: TransformConfig) => {
  const { errorLevel, order, supportedMetaKeys, override } = config;

  const doError = validateErrorAction(errorLevel);

  const metablock = Object.assign({}, metablockInput, override);
  // filled default meta
  const hasMetablockProperty = (key: string) => Object.prototype.hasOwnProperty.call(metablock, key);
  if (!hasMetablockProperty('name')) {
    metablock.name = 'New Script';
  }
  if (!hasMetablockProperty('description')) {
    metablock.description = 'Do something awesome!';
  }
  if (!hasMetablockProperty('namespace')) {
    metablock.namespace = 'https://www.npmjs.com/package/vite-plugin-userscript';
  }
  if (!hasMetablockProperty('grant')) {
    metablock.grant = 'none';
  }
  const restIndex = order.indexOf('...');
  const sortedEntries = Object.entries(metablock);
  sortedEntries.sort(([key1], [key2]) => {
    const idx1 = order.indexOf(key1);
    const idx2 = order.indexOf(key2);
    const i = idx1 < 0 ? restIndex : idx1;
    const j = idx2 < 0 ? restIndex : idx2;
    return i - j;
  });


  const resultEntries = [];
  for (const [metaKey, metaValue] of sortedEntries) {
    if (supportedMetaKeys.includes(metaKey)) {
      const transformFn = META_ENTRIES_TRANSFORM_MAP[metaKey];
      const transformedEntries = transformFn(doError)(metaValue);
      if (transformedEntries) {
        resultEntries.push(...transformedEntries);
      }
    } else {
      const errorMessage = `Unknown meta key: ${metaKey}`;
      if (errorLevel === 'error') {
        throw new Error(errorMessage);
      } else if (errorLevel === 'warn') {
        console.warn(errorMessage);
      }
    }
  }
  return resultEntries;
};

const getMetaKeyMaxLengthFromMetaEntries = (metaEntries: string[][]) => {
  const len = {
    name: 0,
    desc: 0,
    other: 0,
  };

  for (const [key] of metaEntries) {
    if (/^name(:.*)?$/.test(key)) {
      len.name = Math.max(len.name, key.length);
    } else if (/^description(:.*)?$/.test(key)) {
      len.desc = Math.max(len.desc, key.length);
    } else {
      len.other = Math.max(len.other, key.length);
    }
  }

  const isOnlyName = len.name === 'name'.length;
  const isOnlyDescription = len.desc === 'description'.length;

  if (isOnlyName && isOnlyDescription) {
    const finalLength = Math.max(len.name, len.desc, len.other);
    return {
      name: finalLength,
      desc: finalLength,
      other: finalLength,
    };
  } else if (isOnlyName) {
    const finalLength = Math.max(len.name, len.other);
    return {
      ...len,
      name: finalLength,
      other: finalLength,
    };
  } else if (isOnlyDescription) {
    const finalLength = Math.max(len.desc, len.other);
    return {
      ...len,
      desc: finalLength,
      other: finalLength,
    };
  }

  return len;
};

const renderMetaEntries = (entries: string[][]) => {
  const len = getMetaKeyMaxLengthFromMetaEntries(entries);

  const toLine = (head: string, tails: string[], padding: number) =>
    `// @${head.padEnd(padding, ' ')} ${tails.join(' ')}`;

  const getPadding = (head: string) => {
    if (/^name(:.*)?$/.test(head)) {
      return len.name;
    } else if (/^description(:.*)?$/.test(head)) {
      return len.desc;
    } else {
      return len.other;
    }
  };

  const lines = [];
  lines.push('// ==UserScript==');
  for (const [head, ...tails] of entries) {
    lines.push(toLine(head, tails, getPadding(head)));
  }
  lines.push('// ==/UserScript==');

  return lines.map(trim).join('\n');
};

export default (options: MetablockPluginOption = {}): Plugin => {
  try {
    const { transformConfig, outputConfig } = parsePluginOptions(options);
    const { applyPatterns } = outputConfig;
    const filter = filenameFilter(applyPatterns);

    return {
      name: 'vite-plugin-userscript:metablock',

      // Use generateBundle instead of renderChunk hook because
      //   there are some magic remove comments after renderChunk
      // ref: https://rollupjs.org/guide/en/#output-generation-hooks
      // ref: https://rollupjs.org/guide/en/#generatebundle
      async generateBundle(outputOptions, bundle) {
        for (const outputChunk of Object.values(bundle)) {
          if (outputChunk.type === 'asset') { continue; }

          const { code, fileName } = outputChunk;
          if (!filter(fileName)) { continue; }

          const metablockInput = await loadMetaFile(options?.file);

          const metablockEntries = transformToMetaEntries(metablockInput, transformConfig);

          const metablockOutput = renderMetaEntries(metablockEntries);

          const prepend = metablockOutput + '\n';
          const prependLineCount = [...prepend.matchAll(/\n/g)]?.length ?? 0;
          outputChunk.code = prepend + code;

          if (outputChunk.map) {
            outputChunk.map.mappings = ';'.repeat(prependLineCount) + outputChunk.map.mappings;
          }
        }
      },
    };
  } catch (error) {
    console.error(error);
    return {
      name: 'vite-plugin-userscript:metablock',
    };
  }
};
