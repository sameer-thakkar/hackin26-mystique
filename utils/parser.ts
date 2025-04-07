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
  allTgids: number[][],
  useAutomatedRankings = false
) => {
  const result = data.reduce((accumulator: any[], currentValue: any) => {
    if (
      useAutomatedRankings
        ? currentValue?.tourGroups?.length
        : currentValue?.pageData?.items?.length
    ) {
      const {
        subCategory,
        category,
        collection,
        pageData,
        tourGroups,
        collectionId,
      } = currentValue || {};
      const { items } = pageData || {};
      accumulator.push({
        ...(subCategory ? { subCategory } : {}),
        ...(category ? { category } : {}),
        ...(collection || collectionId
          ? useAutomatedRankings
            ? { collection: { id: collectionId } }
            : { collection }
          : {}),
        items: useAutomatedRankings ? tourGroups : items,
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

export const sortProducts = (allData: any[]) => {
  if (!allData?.length) return allData;

  // Find the first collection's items to use as reference order
  const referenceOrder = allData.find((category) => category.collection)?.items;
  if (!referenceOrder?.length) return allData;

  // Create a map of reference order indices for O(1) lookup
  const referenceOrderMap = new Map(
    referenceOrder.map((item: any, index: number) => [item.id, index])
  );

  // Sort each category's items based on the reference order
  return allData.map((category) => ({
    ...category,
    items: [...category.items].sort((a, b) => {
      const indexA = referenceOrderMap.get(a.id);
      const indexB = referenceOrderMap.get(b.id);

      // If both items are in reference order, sort by their position
      if (
        indexA !== null &&
        typeof indexA === 'number' &&
        indexB !== null &&
        typeof indexB === 'number'
      ) {
        return indexA - indexB;
      }
      // If only one item is in reference order, prioritize it
      if (indexA !== undefined) return -1;
      if (indexB !== undefined) return 1;
      // If neither item is in reference order, maintain original order
      return 0;
    }),
  }));
};
