export const UNIT_ABBREVIATIONS = ['k', 'm', 'b', 't'];

const toFixedWithPrecision = (num: number, precision: number) => {
  const precisionExp = 10 ** precision;
  return Math.trunc(Math.floor(num * precisionExp)) / precisionExp;
};

export const shortenNumberToUnits = (num = 0) => {
  if (num < 1000) return num.toString();
  let truncatedNumber = '';
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

export function roundOffTo(num: number, roundingFactor: number) {
  return Math.round(num / roundingFactor) * roundingFactor;
}
