export const chunkArray = (array: any[], itemsPerChunk: number): any[] => {
  return array.reduce((resultArray, item, index) => {
    const chunkIndex = Math.floor(index / itemsPerChunk);
    if (!resultArray[chunkIndex]) {
      resultArray[chunkIndex] = [];
    }
    resultArray[chunkIndex].push(item);
    return resultArray;
  }, []);
};

export const getUniqueArrayItemsBy = (
  array: any[],
  keyProps: string[]
): any[] =>
  Object.values(
    array.reduce((uniqueMap, item) => {
      const key = keyProps.map((k) => item[k]).join('|');
      if (!(key in uniqueMap)) uniqueMap[key] = item;
      return uniqueMap;
    }, {})
  );
