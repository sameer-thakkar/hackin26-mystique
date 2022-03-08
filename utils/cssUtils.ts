export const pxToRem = (px: number, base: number = 16) => {
  return (1 / base) * px;
};
