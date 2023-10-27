// @ts-expect-error Could not find a declaration file for module 'prismic-reactjs'.
import { RichText } from 'prismic-reactjs';

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
      const { subCategory, category, pageData } = currentValue || {};
      const { items } = pageData || {};
      accumulator.push({
        ...(subCategory ? { subCategory } : {}),
        ...(category ? { category } : {}),
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

export const extractFirstRichTextSliceContent = (
  CFData: Record<string, any>,
  uid: string
) => {
  const data = CFData[uid]?.body;
  let richTextData = '';

  for (let i = 0; i < data?.length; i++) {
    if (data[i]?.slice_type === 'rich_text') {
      richTextData = RichText.asText(data[i]?.items[0]?.text);
      break;
    }
  }
  return richTextData;
};
