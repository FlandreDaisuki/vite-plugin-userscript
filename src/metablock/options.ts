import { isNil, isPlainObject } from './validator';
import { unique } from './utils';
import { UnknownScriptManager } from './error';
import { ALL_META_KEYS, COMPATIBLE_META_KEYS, DEFAULT_ORDER, TAMPERMONKEY_EXCLUSIVE_META_KEYS, VIOLENTMONKEY_EXCLUSIVE_META_KEYS } from './meta';

enum ScriptManager {
  Tampermonkey,
  Greasemonkey,
  Greasemonkey4,
  Violentmonkey,
  Compatible, // intersection of all above
  All, // union of all above
}

const toScriptManagerEnum = (name: unknown) => {
  const managerName = String(name ?? 'all').toLowerCase().trim();

  switch (managerName) {
  case 'tm':
  case 'tampermonkey': {
    return ScriptManager.Tampermonkey;
  }
  case 'gm3':
  case 'greasemonkey3': {
    return ScriptManager.Greasemonkey;
  }
  case 'gm':
  case 'gm4':
  case 'greasemonkey':
  case 'greasemonkey4': {
    return ScriptManager.Greasemonkey4;
  }
  case 'vm':
  case 'violentmonkey': {
    return ScriptManager.Violentmonkey;
  }
  case 'compatible': {
    return ScriptManager.Compatible;
  }
  case 'all': {
    return ScriptManager.All;
  }
  default:
    throw new UnknownScriptManager(`Unknown script manager: ${managerName}`);
  }
};

const getSupportedMetaKeysByScriptManager = (manager: ScriptManager) => {
  switch (manager) {
  case ScriptManager.Tampermonkey:{
    return [
      ...COMPATIBLE_META_KEYS,
      ...TAMPERMONKEY_EXCLUSIVE_META_KEYS,
    ];
  }
  case ScriptManager.Greasemonkey:
  case ScriptManager.Greasemonkey4: {
    return [...COMPATIBLE_META_KEYS];
  }
  case ScriptManager.Violentmonkey: {
    return [
      ...COMPATIBLE_META_KEYS,
      ...VIOLENTMONKEY_EXCLUSIVE_META_KEYS,
    ];
  }
  case ScriptManager.Compatible: {
    return [...COMPATIBLE_META_KEYS];
  }
  case ScriptManager.All: {
    return [...ALL_META_KEYS];
  }
  default:
    return [];
  }
};

const toValidOrder = (orderInput: string[], supportedMetaKeys: string[]) => {
  const order = [...orderInput];

  const restIndex = order.indexOf('...');
  if (restIndex >= 0) {
    order.splice(restIndex, 1, ...DEFAULT_ORDER);
  } else {
    order.push(...DEFAULT_ORDER);
  }

  return unique(order)
    .filter((key) => key === '...' || supportedMetaKeys.includes(key));
};

export const parsePluginOptions = (options?: MetablockPluginOption) => {
  const opt = options ?? {};
  const applyPatterns = isNil(opt.applyTo)
    ? [/[.]user[.]js$/]
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    : ([] as OutputApplyPattern[]).concat(opt.applyTo!);

  const managers = isNil(opt.manager)
    ? ['all']
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    : ([] as string[]).concat(opt.manager!);

  const supportedMetaKeys = unique(
    managers
      .map(toScriptManagerEnum)
      .flatMap(getSupportedMetaKeysByScriptManager)
  );

  const errorLevel = opt?.errorLevel ?? 'warn';

  const override = options?.override ?? {};

  if (!isPlainObject(override)) {
    throw new Error('override must be an object');
  }

  const order = toValidOrder(opt?.order ?? [], supportedMetaKeys);

  return {
    transformConfig: {
      order,
      override,
      managers,
      errorLevel,
      supportedMetaKeys,
    },
    outputConfig: {
      applyPatterns,
    },
  };
};
