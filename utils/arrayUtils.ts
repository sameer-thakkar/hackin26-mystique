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
): any[] => {
  if (!array) return [];
  const updatedArray: any[] = [];
  const uniqueMap: Record<string, boolean> = {};

  array.forEach((item) => {
    const key = keyProps.map((k) => item[k]).join('|');

    if (uniqueMap[key]) {
      return;
    }

    uniqueMap[key] = true;
    updatedArray.push(item);
  });

  return updatedArray;
};

export const groupBy = (array: Record<string, any>[], key: string) => {
  return array.reduce(function (acc, obj) {
    (acc[obj[key]] = acc[obj[key]] || []).push(obj);
    return acc;
  }, {});
};

export const arrayMedian = (arr: Array<any>) => {
  const half = Math.floor(arr.length / 2);
  arr.sort((a, b) => a - b);

  if (arr.length % 2) return arr[half];
  return (arr[half - 1] + arr[half]) / 2.0;
};
