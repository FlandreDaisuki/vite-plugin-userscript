import semver from 'semver';
import { isGlobURI, isPlainObject, isString, isURI, isURIMatchPattern, isValidConnectMetaValue } from './validator';

type DoErrorFn = (msg: string) => void | never;
type TransformFn = (doError: DoErrorFn) => (val: unknown) => void | string[][];

export const DEFAULT_ORDER = [
  'name',
  'description',
  'namespace',
  '...',
  'grant',
];

export const createMultilingual = (key:string) => (doError: DoErrorFn) => (val: unknown) => {
  if (!val) {
    return doError(`${key}'s meta value can't be falsy`);
  }

  if (isString(val)) {
    return [[key, val as string]];
  }

  if (isPlainObject(val)) {
    const langRecord = val as Record<string, string>;
    if (!langRecord.default) {
      return doError(`${key}.default is required`);
    }

    return Object.entries(langRecord).map(([lang, text]) => {
      const langKey = lang === 'default' ? `${key}` : `${key}:${lang}`;
      return [langKey, text];
    }).sort(([a], [b]) => a.localeCompare(b));
  }

  return doError(`${key}'s meta value is an invalid type`);
};

export const createBinaryString = (key:string) => (doError: DoErrorFn) => (val: unknown) => {
  if (!val) {
    return doError(`${key}'s meta value can't be falsy`);
  }

  if (!isString(val)) {
    return doError(`${key}'s meta value should be string type`);
  }

  return [[key, val as string]];
};

export const createBinaryStringArray = (key:string) => (doError: DoErrorFn) => (val: unknown) => {
  if (!val) {
    return doError(`${key}'s meta value can't be falsy`);
  }

  if (Array.isArray(val)) {
    const goods = val.map((v) => createBinaryString(key)(doError)(v))
      .filter(Boolean)
      .flat();
    if (goods.length) {
      return goods as string[][];
    }
  }

  if (!isString(val)) {
    return doError(`${key}'s meta value should be string or string[] type`);
  }

  return createBinaryString(key)(doError)(val);
};

export const createBinaryURI = (key:string) => (doError: DoErrorFn) => (val: unknown) => {
  if (!val) {
    return doError(`${key}'s meta value can't be falsy`);
  }

  if (!isString(val)) {
    return doError(`${key}'s meta value should be string type`);
  }

  if (!isURI(val)) {
    doError(`${key}'s meta value should be a valid URI`);
  }
  return [[key, val as string]];
};

export const createBinaryURIArray = (key:string) => (doError: DoErrorFn) => (val: unknown) => {
  if (!val) {
    return doError(`${key}'s meta value can't be falsy`);
  }

  if (Array.isArray(val)) {
    const goods = val.map((v) => createBinaryURI(key)(doError)(v))
      .filter(Boolean)
      .flat();
    if (goods.length) {
      return goods as string[][];
    }
  }

  if (!isString(val)) {
    return doError(`${key}'s meta value should be string or string[] type`);
  }

  return createBinaryURI(key)(doError)(val);
};

export const createBinaryGlobURI = (key:string) => (doError: DoErrorFn) => (val: unknown) => {
  if (!val) {
    return doError(`${key}'s meta value can't be falsy`);
  }

  if (!isString(val)) {
    return doError(`${key}'s meta value should be string type`);
  }

  if (!isGlobURI(val)) {
    doError(`${key}'s meta value should be a valid glob URI`);
  }
  return [[key, val as string]];
};

export const createBinaryGlobURIArray = (key:string) => (doError: DoErrorFn) => (val: unknown) => {
  if (!val) {
    return doError(`${key}'s meta value can't be falsy`);
  }

  if (Array.isArray(val)) {
    const goods = val.map((v) => createBinaryGlobURI(key)(doError)(v))
      .filter(Boolean)
      .flat();

    if (goods.length) {
      return goods as string[][];
    }
  }

  if (!isString(val)) {
    return doError(`${key}'s meta value should be string or string[] type`);
  }

  return createBinaryGlobURI(key)(doError)(val);
};

export const createBinaryURIMatchPattern = (key:string) => (doError: DoErrorFn) => (val: unknown) => {
  if (!val) {
    return doError(`${key}'s meta value can't be falsy`);
  }

  if (!isString(val)) {
    return doError(`${key}'s meta value should be string type`);
  }

  if (!isURIMatchPattern(val)) {
    doError(`${key}'s meta value should be a valid URI`);
  }
  return [[key, val as string]];
};

export const createBinaryURIMatchPatternArray = (key:string) => (doError: DoErrorFn) => (val: unknown) => {
  if (!val) {
    return doError(`${key}'s meta value can't be falsy`);
  }

  if (Array.isArray(val)) {
    const goods = val.map((v) => createBinaryURIMatchPattern(key)(doError)(v))
      .filter(Boolean)
      .flat();
    if (goods.length) {
      return goods as string[][];
    }
  }

  if (!isString(val)) {
    return doError(`${key}'s meta value should be string or string[] type`);
  }

  return createBinaryURIMatchPattern(key)(doError)(val);
};

export const createBinaryConnectPattern = (key:string) => (doError: DoErrorFn) => (val: unknown) => {
  if (!val) {
    return doError(`${key}'s meta value can't be falsy`);
  }

  if (!isString(val)) {
    return doError(`${key}'s meta value should be string type`);
  }

  if (!isValidConnectMetaValue(val)) {
    doError(`${key}'s meta value should be a valid connect pattern`);
  }
  return [[key, val as string]];
};

export const createBinaryConnectPatternArray = (key:string) => (doError: DoErrorFn) => (val: unknown) => {
  if (!val) {
    return doError(`${key}'s meta value can't be falsy`);
  }

  if (Array.isArray(val)) {
    const goods = val.map((v) => createBinaryConnectPattern(key)(doError)(v))
      .filter(Boolean)
      .flat();
    if (goods.length) {
      return goods as string[][];
    }
  }

  if (!isString(val)) {
    return doError(`${key}'s meta value should be string or string[] type`);
  }

  return createBinaryURIMatchPattern(key)(doError)(val);
};

export const createBinaryEnum = (key:string, valEnums: string[]) => (doError: DoErrorFn) => (val: unknown) => {
  if (!val) {
    return doError(`${key}'s meta value can't be falsy`);
  }

  if (!Array.isArray(valEnums) || !valEnums.every(isString)) {
    return doError(`${key}'s valEnums should be string[] type`);
  }

  if (!isString(val)) {
    return doError(`${key}'s meta value should be string type`);
  }

  const maybeEnumVal = val as string;
  if (!valEnums.includes(maybeEnumVal)) {
    return doError(`${key}'s meta value should be one of [${valEnums.join(', ')}]`);
  }

  return [[key, maybeEnumVal]];
};

export const createBinaryVersion = (key:string) => (doError: DoErrorFn) => (val: unknown) => {
  if (!val) {
    return doError(`${key}'s meta value can't be falsy`);
  }

  if (!isString(val)) {
    return doError(`${key}'s meta value should be string type`);
  }

  const version = val as string;
  if (semver.valid(version)) {
    const cleanedVersion = semver.clean(version);
    if (cleanedVersion) {
      return [[key, cleanedVersion]];
    }
  }

  const coerce = semver.coerce(version);
  if (semver.valid(coerce) && coerce !== null) {
    doError(`${key} can be transform to ${coerce}`);
    return [[key, coerce.version]];
  }

  return doError(`${key}'s meta value is invalid`);
};

export const createUnary = (key:string) => (doError: DoErrorFn) => (val: unknown) => {
  if (!val) {
    return doError(`${key}'s meta value can't be falsy`);
  }

  return [[key]];
};

export const createTernaryURI = (key:string) => (doError: DoErrorFn) => (val: unknown) => {
  if (!val) {
    return doError(`${key}'s meta value can't be falsy`);
  }

  if (!isPlainObject(val)) {
    return doError(`${key}'s meta value should be plain object type`);
  }

  const uriMap = val as Record<string, string>;

  const resultEntries = [] as string[][];
  for (const [uriKey, uriVal] of Object.entries(uriMap)) {
    if (!isURI(uriVal)) {
      return doError(`${key}'s meta value should be URI`);
    }

    resultEntries.push([key, uriKey, uriVal]);
  }

  return resultEntries;
};

export const createGrant = (key: string) => (doError: DoErrorFn) => (val: unknown) => {
  if (!val) {
    return [[key, 'none']];
  }

  if (isString(val)) {
    return [[key, val as string]];
  }

  if (Array.isArray(val)) {
    const goods: (void | string[])[] = val.map((v) => createGrant(key)(doError)(v))
      .filter(Boolean)
      .flat();
    if (goods.length) {
      return goods as string[][];
    }
  }

  return [[key, 'none']];
};

export const RUN_AT_ENUM = ['end', 'start', 'idle', 'body'].map((s) => `document-${s}`).concat('context-menu');
export const INJECT_INTO_ENUM = ['page', 'content', 'auto'];


export const COMPATIBLE_META_ENTRY_TRANSFORM_MAP: Record<string, TransformFn> = {
  // explicit
  'name': createMultilingual('name'),
  'namespace': createBinaryString('namespace'),
  'description': createMultilingual('description'),
  'version': createBinaryVersion('version'),
  'match': createBinaryURIMatchPatternArray('match'),
  'include': createBinaryGlobURIArray('include'),
  'exclude': createBinaryGlobURIArray('exclude'),
  'icon': createBinaryURI('icon'),
  'require': createBinaryURIArray('require'),
  'run-at': createBinaryEnum('run-at', RUN_AT_ENUM),
  'resource': createTernaryURI('resource'),
  'noframes': createUnary('noframes'),
  'grant': createGrant('grant'),

  // implicit
  'author': createBinaryString('author'),

  // Greasy Fork
  'updateURL': createBinaryURI('updateURL'),
  'installURL': createBinaryURI('installURL'),
  'downloadURL': createBinaryURI('downloadURL'),
  'license': createBinaryString('license'),
  'supportURL': createBinaryURI('supportURL'),
  'contributionURL': createBinaryURI('contributionURL'),
  'contributionAmount': createBinaryString('contributionAmount'),
  'compatible': createBinaryStringArray('compatible'),
  'incompatible': createBinaryStringArray('incompatible'),
  'antifeature': createMultilingual('antifeature'),
};

export const COMPATIBLE_META_KEYS = Object.keys(COMPATIBLE_META_ENTRY_TRANSFORM_MAP);

export const TAMPERMONKEY_EXCLUSIVE_META_ENTRY_TRANSFORM_MAP: Record<string, TransformFn> = {
  // The authors homepage that is used at the options page to link from the scripts name to the given page.
  // Please note that if the @namespace tag starts with 'http://' its content will be used for this too.
  homepage: createBinaryURI('homepage'),
  homepageURL: createBinaryURI('homepageURL'),
  website: createBinaryURI('website'),
  source: createBinaryURI('source'),

  // Icon URLs
  defaulticon: createBinaryURI('defaulticon'),
  icon64: createBinaryURI('icon64'),
  iconURL: createBinaryURI('iconURL'),
  icon64URL: createBinaryURI('icon64URL'),

  connect: createBinaryConnectPattern('connect'),
  nocompat: createBinaryEnum('nocompat', ['Chrome', 'chrome']),
};

export const TAMPERMONKEY_EXCLUSIVE_META_KEYS = Object.keys(TAMPERMONKEY_EXCLUSIVE_META_ENTRY_TRANSFORM_MAP);

export const VIOLENTMONKEY_EXCLUSIVE_META_ENTRY_TRANSFORM_MAP: Record<string, TransformFn> = {
  'exclude-match': createBinaryURIMatchPatternArray('exclude-match'),
  'inject-into': createBinaryEnum('inject-into', INJECT_INTO_ENUM),
};

export const VIOLENTMONKEY_EXCLUSIVE_META_KEYS = Object.keys(VIOLENTMONKEY_EXCLUSIVE_META_ENTRY_TRANSFORM_MAP);

export const META_ENTRIES_TRANSFORM_MAP = {
  ...COMPATIBLE_META_ENTRY_TRANSFORM_MAP,
  ...TAMPERMONKEY_EXCLUSIVE_META_ENTRY_TRANSFORM_MAP,
  ...VIOLENTMONKEY_EXCLUSIVE_META_ENTRY_TRANSFORM_MAP,
};

export const ALL_META_KEYS = Object.keys(META_ENTRIES_TRANSFORM_MAP);
