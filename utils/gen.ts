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
