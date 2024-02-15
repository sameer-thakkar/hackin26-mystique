import { getDiscountedProducts, getTGIDListForMonth } from 'utils/helper';

export const getFilteredObject = (
  allTours: Record<string, any>,
  allowedTgids: number[]
) => {
  let allowedTours: Record<string, any> = [];

  allTours?.forEach((experience: Record<string, any>) => {
    if (allowedTgids.includes(Number(experience?.tgid))) {
      allowedTours.push(experience);
    }
  });

  allTours = allowedTours;
  return allTours;
};

export const getAllowedTgids = (
  displayMonth: string,
  allTours: Record<string, any>
) => {
  switch (displayMonth) {
    case 'ALL':
      return Object.keys(allTours).map((tgid) => Number(tgid));
    case 'Discounted':
      return getDiscountedProducts(allTours);
    default:
      return getTGIDListForMonth(allTours, displayMonth);
  }
};

export const getTgidAsKey = (shows: any[]) => {
  const result: Record<string, any> = {};
  shows?.forEach((show) => {
    const tgid = show?.tgid;
    result[tgid] = show;
  });
  return result;
};
