export const isBitSet = (n, index) => {
  return (n & (1 << index)) !== 0;
};

export const numberOfSetBits = (n) => {
  let count = 0;
  let copyN = n;
  while (copyN !== 0) {
    copyN &= copyN - 1;
    count++;
  }
  return count;
};

/*
Convets string into 32 bit umber
* */
export const hashCode = (str) => {
  let hash = 0;
  if (!str || str.length === 0) return hash;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash &= hash; // Convert to 32bit integer
  }
  return Math.abs(hash);
};

export const intInRangeFromString = (string, min, max) => {
  const numberFromString = hashCode(string);
  return (numberFromString % (max - min)) + min;
};

export const modulus = (x, y) => {
  return ((x % y) + y) % y;
};
