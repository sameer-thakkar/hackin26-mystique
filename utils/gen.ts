import { UNIT_ABBREVIATIONS } from 'const/index';

export const fromEntries = (iterable) =>
  [...iterable].reduce(
    (obj, [key, val]) => Object.assign(obj, { [key]: val }),
    {}
  );

export const hashCode = (input) => {
  let hash = 0;
  if (input.length === 0) return hash;
  for (let i = 0; i < input.length; i++) {
    const char = input.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash &= hash; // Convert to 32bit integer
  }
  return hash;
};

export const isServer = () => {
  return !process.browser;
};

export const toFixedWithPrecision = (num, precision) => {
  const precisionExp = 10 ** precision;
  return Math.trunc(Math.round(num * precisionExp)) / precisionExp;
};

export const truncateNumber = (num = 0, truncateAfter = 3) => {
  if (num < 10 ** (truncateAfter - 1)) return num.toString();
  let truncatedNumber = String(num);
  for (let i = UNIT_ABBREVIATIONS.length - 1; i >= 0; i--) {
    const truncationSize = 10 ** ((i + 1) * 3);
    if (num >= truncationSize) {
      truncatedNumber =
        Number(toFixedWithPrecision(num / truncationSize, 1)).toLocaleString() +
        UNIT_ABBREVIATIONS[i];
      break;
    }
  }
  return truncatedNumber.toString();
};
