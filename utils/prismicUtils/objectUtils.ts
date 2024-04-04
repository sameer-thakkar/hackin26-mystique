export const partialObjectEquals = <
  A extends Record<string, any>,
  B extends Record<string, any>
>(
  objectA: A,
  objectB: B,
  exclusionKeyList: Array<keyof A | keyof B>
): boolean => {
  if (!objectA || !objectB) return false;
  const keysA = Object.keys(objectA ?? {});
  const keysB = Object.keys(objectB ?? {});

  return keysA.concat(keysB).every((key) => {
    if (exclusionKeyList.includes(key)) return true;
    return objectA[key] === objectB[key];
  });
};
