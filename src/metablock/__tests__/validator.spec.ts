import { isGlobURI, isIPv4, isPlainObject, isURI, isURIMatchPattern } from '../validator';

test('isURI', () => {
  expect(isURI('https://example.com')).toBe(true);

  expect(isURI([])).toBe(false);
});

test('isPlainObject', () => {
  class Foo {}

  expect(isPlainObject({})).toBe(true);
  expect(isPlainObject({ a: 1 })).toBe(true);
  expect(isPlainObject({ constructor: Foo })).toBe(true);

  expect(isPlainObject([1, 2, 3])).toBe(false);
  expect(isPlainObject(new Foo())).toBe(false);
});

// test cases from https://developer.chrome.com/docs/extensions/mv3/match_patterns/
test('isURIMatchPattern', () => {
  expect(isURIMatchPattern('https://*/*')).toBe(true);
  expect(isURIMatchPattern('file:///foo*')).toBe(true);
  expect(isURIMatchPattern('http://127.0.0.1/*')).toBe(true);
  expect(isURIMatchPattern('*://mail.google.com/*')).toBe(true);
  expect(isURIMatchPattern('https://example.org/foo/bar.html')).toBe(true);
  expect(isURIMatchPattern('https://*.google.com/foo*bar')).toBe(true);

  expect(isURIMatchPattern('*')).toBe(false);
  expect(isURIMatchPattern(' ')).toBe(false);
  expect(isURIMatchPattern(null)).toBe(false);
  expect(isURIMatchPattern('foo://*')).toBe(false);
  expect(isURIMatchPattern('http:/bar')).toBe(false);
  expect(isURIMatchPattern('https://*foo/bar')).toBe(false);
  expect(isURIMatchPattern('https://foo.*.bar/baz')).toBe(false);
  expect(isURIMatchPattern('https://www.google.com')).toBe(false);
});

test('isGlobURI', () => {
  expect(isGlobURI('*')).toBe(true);
  expect(isGlobURI('foo://*')).toBe(true);
  expect(isGlobURI('http:/bar')).toBe(true);
  expect(isGlobURI('http://*/*')).toBe(true);
  expect(isGlobURI('file:///foo*')).toBe(true);
  expect(isGlobURI('http://*/foo*')).toBe(true);
  expect(isGlobURI('http://*foo/bar')).toBe(true);
  expect(isGlobURI('http://foo.*.bar/baz')).toBe(true);
  expect(isGlobURI('*://mail.google.com/*')).toBe(true);
  expect(isGlobURI('http://www.google.com')).toBe(true);
  expect(isGlobURI('https://*.google.com/foo*bar')).toBe(true);
  expect(isGlobURI('http://example.org/foo/bar.html')).toBe(true);

  expect(isGlobURI(' ')).toBe(false);
  expect(isGlobURI(null)).toBe(false);
});

test('isIPv4', () => {
  expect(isIPv4('0.0.0.0')).toBe(true);
  expect(isIPv4('255.255.255.255')).toBe(true);

  expect(isIPv4('::1')).toBe(false);
  expect(isIPv4('0.0.0')).toBe(false);
  expect(isIPv4('01.02.03.04')).toBe(false);
  expect(isIPv4('100.200.300.400')).toBe(false);
  expect(isIPv4('001.002.003.004')).toBe(false);
});
