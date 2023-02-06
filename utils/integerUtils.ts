export const isBitSet = (n: number, index: number) => {
  return (n & (1 << index)) !== 0;
};

export const numberOfSetBits = (n: number) => {
  let count = 0;
  let copyN = n;
  while (copyN !== 0) {
    copyN &= copyN - 1;
    count++;
  }
  return count;
};

/**
 * It takes a string and returns a 32 bit integer
 * @param {string} str - The string to hash.
 * @returns A hash code for the given string.
 */
export const hashCode = (str: string) => {
  let hash = 0;
  if (!str || str.length === 0) return hash;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash &= hash;
  }
  return Math.abs(hash);
};

export const intInRangeFromString = (
  string: string,
  min: number,
  max: number
) => {
  const numberFromString = hashCode(string);
  return (numberFromString % (max - min)) + min;
};

export const modulus = (x: any, y: any) => {
  return ((x % y) + y) % y;
};
