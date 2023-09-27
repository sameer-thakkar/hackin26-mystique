import type { PrismicDocumentWithUID } from '@prismicio/types';

interface Cookies {
  cookies: { [key: string]: any };
}
export interface ICommonProps {
  mbCity: string;
  lang: string;
}
export interface IGenerateCityPageData extends ICommonProps, Cookies {
  mbCountry: string;
}

export interface INearbyCollection extends Cookies, ICommonProps {}

export interface IGetLangBasedData {
  prismicDocs: PrismicDocumentWithUID[];
  lang: string;
}

export interface IGetLangBasedCitiesData extends IGetLangBasedData {
  cityListData: Record<string, any>;
}

export interface IGetNearbyCities extends ICommonProps, Cookies {
  mbCountry: string;
}

export interface IGetCityListData extends Cookies {}

export interface ICollectionItem {
  id: string;
  displayName: string;
  cardImageUrl: string;
}

export interface IGetNormalisedCollectionData {
  prismicCollectionMap: Record<string, any>;
  collectionApiData: Record<string, any>[];
  lang: string;
}

export interface IGetCollectionDataWithPrismicInfo extends ICommonProps {
  collectionApiData: Record<string, any>[];
}

// categories.ts
export interface IGetCategoriesData extends ICommonProps, Cookies {}
export interface ISubCategoryEntity {
  id: string;
  name: string;
}
export interface ICategoryEntity {
  id: string;
  name: string;
  subCategories: ISubCategoryEntity[];
}
export interface ICategoryApiData {
  categories: ICategoryEntity[];
  starredCategoriesAndSubCategories: Record<string, any>[];
}
export interface ICategorySubcategoryMap {
  categoriesMap: Map<number, ICategoryEntity>;
  subCategoriesMap: Map<number, ISubCategoryEntity>;
}
export interface IGetPopularSubCategoriesData extends ICommonProps {
  categoryApiData: ICategoryApiData;
  categorySubcategoryMap: ICategorySubcategoryMap;
}
export interface IGetPopularCategoriesData extends ICommonProps {
  categorySubcategoryMap: ICategorySubcategoryMap;
}
export interface IFinalData {
  uid: string;
  rank: number;
  starredRank: number;
}

export interface IGetExploreSectionData extends ICommonProps, Cookies {
  categorySubcategoryMap: ICategorySubcategoryMap;
}

export interface IGetExploreSectionSubCategoriesData
  extends ICommonProps,
    Cookies {
  selectedSubcatNamesArr: string[];
  selectedSubcatNamesMap: Map<number, ISubCategoryEntity>;
}

export interface IGetExploreSectionCategoriesData extends ICommonProps {
  selectedCatNamesArr: string[];
  selectedCatNamesMap: Map<number, ICategoryEntity>;
  subCategoriesMap: Map<number, ISubCategoryEntity>;
}
// categories.ts end
