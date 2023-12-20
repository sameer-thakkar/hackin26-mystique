import type { Simplify } from 'types.prismic';

type TTransform<T> = {
  currentPageData: T;
  baseLangData: T;
  array: string[];
};

export const transformStringValues = <T>({
  currentPageData,
  baseLangData,
  array,
}: TTransform<T>) =>
  array.reduce(
    (acc, elem) => ({
      ...acc,
      [elem]: currentPageData[elem as keyof T] || baseLangData[elem as keyof T],
    }),
    {} as Simplify<T>
  );
