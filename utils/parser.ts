import { asText } from '@prismicio/helpers';

export const extractTgidsFromCategories = (arr: Record<string, any>[]) =>
  arr?.length > 0
    ? arr
        .map(
          (data) =>
            data?.items?.map((product: Record<string, any>) => product?.id) ??
            []
        )
        .flat()
    : [];

export const accumulatingCategoryAndItemsData = (
  data: any,
  categoriesWithProducts: any,
  allTgids: number[][]
) => {
  const result = data.reduce((accumulator: any[], currentValue: any) => {
    if (currentValue?.pageData?.items?.length) {
      const { subCategory, category, collection, pageData } =
        currentValue || {};
      const { items } = pageData || {};
      accumulator.push({
        ...(subCategory ? { subCategory } : {}),
        ...(category ? { category } : {}),
        ...(collection ? { collection } : {}),
        items,
      });
    }
    return accumulator;
  }, []);

  const tgids: number[] = extractTgidsFromCategories(result);
  if (result?.length) {
    categoriesWithProducts.push(result);
  }
  if (tgids?.length) {
    allTgids.push(tgids);
  }
};

export const accumulatingCategoryDataFromCollectionItems = (
  filteredCollectionData: any,
  categoriesWithProducts: any,
  allTgids: number[][],
  subCategoryData: Record<string, any>[]
) => {
  let subCategory = {};
  const result = filteredCollectionData?.map(
    (c: Record<string, any>, index: number) => {
      const { sections } = c || {};
      const filteredData = sections?.filter(
        (curr: { tourGroups: { items: [] } }) => {
          return curr?.tourGroups?.items?.length;
        }
      );

      let filterTgids: [][] = [];

      filteredData?.forEach(
        (section: {
          tourGroups: {
            items: [];
          };
        }) => {
          if (section?.tourGroups?.items) {
            subCategory = subCategoryData[index]?.subCategory;
            filterTgids = filterTgids.concat(section.tourGroups.items);
          }
        }
      );
      return {
        subCategory,
        items: filterTgids,
      };
    }
  );

  const tgids: number[] = extractTgidsFromCategories(result);
  if (result?.length) {
    categoriesWithProducts.push(result);
  }
  if (tgids?.length) {
    allTgids.push(tgids);
  }
};

export const extractFirstRichTextSliceContent = (data: Record<string, any>) => {
  let richTextData: string | null = '';

  for (let i = 0; i < data?.length; i++) {
    if (data[i]?.slice_type === 'rich_text') {
      richTextData = asText(data[i]?.items[0]?.text);
      break;
    }
  }
  return richTextData || '';
};
