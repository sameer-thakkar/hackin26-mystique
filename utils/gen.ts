export const fromEntries = (iterable) =>
  [...iterable].reduce(
    (obj, [key, val]) => Object.assign(obj, { [key]: val }),
    {}
  );
