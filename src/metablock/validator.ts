import { isUri } from 'valid-url';

export const isURI = (value: unknown) => {
  return Boolean(isUri(String(value)));
};

export const isNil = (value: unknown) => {
  return value === null || value === undefined;
};

export const isString = (value: unknown) => typeof(value) === 'string';

const isObjectLike = (value: unknown) => value != null && typeof(value) == 'object';
const getPrototype = (value: unknown) => Object.getPrototypeOf(value);
const hasOwnProperty = Object.prototype.hasOwnProperty;
/**
 * _.isPlainObject() from lodash
 *
 * ref: https://lodash.com/docs/4.17.15#isPlainObject
 */
export const isPlainObject = (value: unknown) => {
  if (!isObjectLike(value) || String(value) !== '[object Object]') {
    return false;
  }
  const proto = getPrototype(value);
  if (proto === null) {
    return true;
  }
  const Ctor = hasOwnProperty.call(proto, 'constructor') && proto.constructor;
  return typeof Ctor == 'function' && Ctor instanceof Ctor
      && Function.prototype.toString.call(Ctor) === Function.prototype.toString.call(Object);
};

/**
 * https://developer.chrome.com/docs/extensions/mv3/match_patterns/
 */
export const isURIMatchPattern = (value: unknown) => {
  const s = String(value);
  return /^([*]|https?|file|ftp):\/\/([*]|(?:\*\.)?[^*/]*)\/.*$/u.test(s);
};

export const isGlobURI = (value: unknown) => {
  const s = String(value);
  return (/^\/.*\/$/).test(s) || isURI(s) || (isString(s) && s.includes('*'));
};

export const isIPv4 = (value: unknown) => {
  const s = String(value);
  if (/^\d{1,3}[.]\d{1,3}[.]\d{1,3}[.]\d{1,3}$/.test(s)) {
    return s.split('.')
      .filter(Boolean)
      .map((t) => [t, parseInt(t)])
      .every(([t, n]) => Number.isInteger(n) && n >= 0 && n <= 255 && String(n) === t);
  }
  return false;
};

export const isValidConnectMetaValue = (value: unknown) => {
  return isIPv4(value)
    || isUri(String(value))
    || /[\w-]+(\.[\w-]+)+/.test(String(value)) // domain without protocol
    || value === '*'
    || value === 'localhost';
};
