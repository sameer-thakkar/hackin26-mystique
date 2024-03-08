export const getLimitDelta = (limit: any) => {
  return Math.floor(limit / 2);
};
export const inFirstHalf = (index: any, limit: any) => {
  const limitDelta = getLimitDelta(limit);
  return index <= limitDelta;
};
export const inLastHalf = (index: any, limit: any, total: any) => {
  const limitDelta = getLimitDelta(limit);
  return total - index - 1 <= limitDelta;
};

export const calcTranslateX = (
  activeIndex: any,
  limit: any,
  total: any,
  sizeInPx: any,
  dotsMargin: number
) => {
  const limitDelta = getLimitDelta(limit);

  if (inFirstHalf(activeIndex, limit)) return 0;
  if (inLastHalf(activeIndex, limit, total)) {
    const translationOffset = (total - limit) * (sizeInPx + dotsMargin);
    return total % 2 === 0 ? translationOffset + 1 : translationOffset;
  }
  return (activeIndex - limitDelta) * (sizeInPx + dotsMargin);
};
export const isAtCenter = (currentIndex: any, activeIndex: any, limit: any) => {
  const limitDelta = getLimitDelta(limit);
  return (
    currentIndex > activeIndex - limitDelta &&
    currentIndex < activeIndex + limitDelta
  );
};

export const isNormalScale = (
  currentIndex: any,
  activeIndex: any,
  limit: any,
  total: any
) => {
  const limitDelta = getLimitDelta(limit);

  if (
    (inFirstHalf(activeIndex, limit) && currentIndex < limit - 1) ||
    (inLastHalf(activeIndex, limit, total) && currentIndex >= total + 1 - limit)
  )
    return true;

  return (
    (inFirstHalf(currentIndex, limit) && activeIndex < limitDelta + 1) ||
    (inLastHalf(currentIndex, limit, total) &&
      activeIndex > total - limitDelta - 2) ||
    isAtCenter(currentIndex, activeIndex, limit)
  );
};
