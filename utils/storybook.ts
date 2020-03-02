export const repeat = (item: any, times: number) => {
  let resultArray = [];
  for (let i = 0; i < times; i++) {
    resultArray.push(item);
  }
  return resultArray;
};
