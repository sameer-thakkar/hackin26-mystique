import { MB_CATEGORISATION } from 'const/index';

export const getPageHeading = ({
  taggedMbType,
  categoryData,
  subCategoryData,
}: {
  taggedMbType: string;
  categoryData: Record<string, any>;
  subCategoryData: Record<string, any>;
}): string => {
  if (taggedMbType === MB_CATEGORISATION.MB_TYPE.A1_CATEGORY)
    return categoryData.heading || '';
  else return subCategoryData.heading || '';
};
