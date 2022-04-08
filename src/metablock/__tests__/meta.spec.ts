import {
  createBinaryConnectPattern,
  createBinaryConnectPatternArray,
  createBinaryEnum,
  createBinaryGlobURI,
  createBinaryGlobURIArray,
  createBinaryString,
  createBinaryStringArray,
  createBinaryURI,
  createBinaryURIArray,
  createBinaryURIMatchPattern,
  createBinaryURIMatchPatternArray,
  createBinaryVersion,
  createGrant,
  createMultilingual,
  createTernaryURI,
  createUnary,
} from '../meta';

// eslint-disable-next-line @typescript-eslint/no-empty-function
const noop = () => {};

test('createMultilingual', () => {
  const multilingual = createMultilingual('name');
  const toMultilingualEntries = multilingual(noop);

  const objectTypeMeta = {
    'en': 'test',
    'zh-TW': '測試',
    'default': 'test',
  };

  expect(toMultilingualEntries('test')).toStrictEqual([
    ['name', 'test'],
  ]);

  expect(toMultilingualEntries(objectTypeMeta)).toStrictEqual([
    ['name', 'test'],
    ['name:en', 'test'],
    ['name:zh-TW', '測試'],
  ]);

  const ObjectTypeMetaWithoutDefault = {
    en: 'test',
  };
  expect(toMultilingualEntries(ObjectTypeMetaWithoutDefault)).toBeUndefined();
});

test('createBinaryString', () => {
  const binaryString = createBinaryString('namespace');
  const toBinaryStringEntries = binaryString(noop);

  expect(toBinaryStringEntries('test')).toStrictEqual([
    ['namespace', 'test'],
  ]);
});

test('createBinaryStringArray', () => {
  const binaryStringArray = createBinaryStringArray('incompatible');
  const toBinaryStringEntries = binaryStringArray(noop);

  expect(toBinaryStringEntries('safari')).toStrictEqual([
    ['incompatible', 'safari'],
  ]);

  expect(toBinaryStringEntries(['chrome', 'safari']))
    .toStrictEqual([
      ['incompatible', 'chrome'],
      ['incompatible', 'safari'],
    ]);
});

test('createBinaryURI', () => {
  const binaryURI = createBinaryURI('homepage');
  const toBinaryURIEntries = binaryURI(noop);

  expect(toBinaryURIEntries('https://example.com')).toStrictEqual([
    ['homepage', 'https://example.com'],
  ]);
});

test('createBinaryURIArray', () => {
  const binaryURIArray = createBinaryURIArray('require');
  const toBinaryURIEntries = binaryURIArray(noop);

  expect(toBinaryURIEntries(['https://example.com/', 'https://example.com/favicon.ico']))
    .toStrictEqual([
      ['require', 'https://example.com/'],
      ['require', 'https://example.com/favicon.ico'],
    ]);
});

test('createBinaryBlobURI', () => {
  const binaryGlobURI = createBinaryGlobURI('include');
  const toBinaryGlobURIEntries = binaryGlobURI(noop);

  expect(toBinaryGlobURIEntries('*')).toStrictEqual([
    ['include', '*'],
  ]);
  expect(toBinaryGlobURIEntries('foo://*')).toStrictEqual([
    ['include', 'foo://*'],
  ]);
});

test('createBinaryBlobURIArray', () => {
  const binaryGlobURIArray = createBinaryGlobURIArray('exclude');
  const toBinaryGlobURIArrayEntries = binaryGlobURIArray(noop);

  expect(toBinaryGlobURIArrayEntries(['*', 'foo://*']))
    .toStrictEqual([
      ['exclude', '*'],
      ['exclude', 'foo://*'],
    ]);
});

test('createBinaryURIMatchPattern', () => {
  const binaryURIMatchPattern = createBinaryURIMatchPattern('match');
  const toBinaryURIMatchPatternEntries = binaryURIMatchPattern(noop);

  expect(toBinaryURIMatchPatternEntries('*://*')).toStrictEqual([
    ['match', '*://*'],
  ]);
});

test('createBinaryURIMatchPatternArray', () => {
  const binaryURIMatchPatternArray = createBinaryURIMatchPatternArray('exclude-match');
  const toBinaryURIMatchPatternArrayEntries = binaryURIMatchPatternArray(noop);

  expect(toBinaryURIMatchPatternArrayEntries(['*://*', 'https://example.com/*']))
    .toStrictEqual([
      ['exclude-match', '*://*'],
      ['exclude-match', 'https://example.com/*'],
    ]);
});

test('createBinaryEnum', () => {
  const binaryEnum = createBinaryEnum('run-at', ['document-start', 'document-end']);
  const toBinaryEnumEntries = binaryEnum(noop);

  expect(toBinaryEnumEntries('document-start')).toStrictEqual([
    ['run-at', 'document-start'],
  ]);
  expect(toBinaryEnumEntries('document-end')).toStrictEqual([
    ['run-at', 'document-end'],
  ]);
  expect(toBinaryEnumEntries('document-idle')).toBeUndefined();
});

test('createBinaryVersion', () => {
  const binaryVersion = createBinaryVersion('version');
  const toBinaryVersionEntries = binaryVersion(noop);

  expect(toBinaryVersionEntries('1.0.0')).toStrictEqual([
    ['version', '1.0.0'],
  ]);

  expect(toBinaryVersionEntries('1.0')).toStrictEqual([
    ['version', '1.0.0'],
  ]);

  expect(toBinaryVersionEntries('1.2.3-alpha')).toStrictEqual([
    ['version', '1.2.3-alpha'],
  ]);

  expect(toBinaryVersionEntries('1-alpha')).toStrictEqual([
    ['version', '1.0.0'],
  ]);

  expect(toBinaryVersionEntries('alpha')).toBeUndefined();
  expect(toBinaryVersionEntries(123)).toBeUndefined();
});

test('createTernaryURI', () => {
  const ternaryURI = createTernaryURI('resource');
  const toTernaryURIEntries = ternaryURI(noop);

  const objectTypeMeta = {
    csv: 'https://example.com/data.csv',
    bgm: 'https://example.com/bgm.mp3',
  };

  expect(toTernaryURIEntries(objectTypeMeta)).toStrictEqual([
    ['resource', 'csv', 'https://example.com/data.csv'],
    ['resource', 'bgm', 'https://example.com/bgm.mp3'],
  ]);
});

test('createUnary', () => {
  const unary = createUnary('noframes');
  const toUnaryEntries = unary(noop);

  expect(toUnaryEntries(true)).toStrictEqual([
    ['noframes'],
  ]);
});

test('createBinaryConnectPattern', () => {
  const binaryConnectPattern = createBinaryConnectPattern('connect');
  const toBinaryConnectPatternEntries = binaryConnectPattern(noop);

  expect(toBinaryConnectPatternEntries('*')).toStrictEqual([
    ['connect', '*'],
  ]);
});

test('createBinaryConnectPatternArray', () => {
  const binaryConnectPatternArray = createBinaryConnectPatternArray('connect');
  const toBinaryConnectPatternArrayEntries = binaryConnectPatternArray(noop);

  expect(toBinaryConnectPatternArrayEntries('1.2.3.4')).toStrictEqual([
    ['connect', '1.2.3.4'],
  ]);

  expect(toBinaryConnectPatternArrayEntries(['*', 'localhost']))
    .toStrictEqual([
      ['connect', '*'],
      ['connect', 'localhost'],
    ]);
});

test('createGrant', () => {
  const grant = createGrant('grant');
  const toGrantEntries = grant(noop);

  expect(toGrantEntries(null)).toStrictEqual([
    ['grant', 'none'],
  ]);

  expect(toGrantEntries('GM_getValue')).toStrictEqual([
    ['grant', 'GM_getValue'],
  ]);

  expect(toGrantEntries(['GM_getValue', 'GM_setValue'])).toStrictEqual([
    ['grant', 'GM_getValue'],
    ['grant', 'GM_setValue'],
  ]);
});
