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
