export const repeat = (item: any, times: number) => {
  let resultArray = [];
  for (let i = 0; i < times; i++) {
    resultArray.push(item);
  }
  return resultArray;
};

export const deepCopy = (obj: Record<any, any>) => {
  // Won't work if Date() is used. So don't try.
  return JSON.parse(JSON.stringify(obj));
};
