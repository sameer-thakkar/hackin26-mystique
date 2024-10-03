import type { TBreadcrumbs } from 'types/breadcrumbs';

export type TSubcategoryPills = Array<{
  id: number;
  name: string;
  label: string;
  url: string;
  iconUrl: string | null;
}>;

export type TCollection = {
  id: number;
  name: string;
  displayName: string;
  url: string;
  cardMedia: Record<string, any>;
  startingPrice: Record<string, any>;
  ratingsInfo: Record<string, any>;
  subtext: string;
};

export type TTopCollectionsCarousel = Array<
  Omit<TCollection, 'ratingsInfo' | 'subtext'>
>;

export type TSubCategoryCarousels = Array<{
  id: number;
  heading: string;
  name: string;
  subCategoryPageUrl: string;
  carouselData: Array<TCollection>;
}>;

export type TSubCategoryCards = Array<TCollection>;

export type TCityCategoriesCarousel = Array<{
  id: number;
  name: string;
  displayName: string;
  url: string;
  media: Record<string, any>;
}>;

export type TCatAndSubCatPageData = {
  isSubCategoryPage: boolean;
  taggedCity: string;
  categoryData: Record<string, any>;
  subCategoryData: Record<string, any>;
  pageHeading: string;
  subCategoryPills: TSubcategoryPills;
  topCollectionsCarousel: TTopCollectionsCarousel;
  subCategoryCarousels: TSubCategoryCarousels;
  subCategoryCards: TSubCategoryCards;
  subCategoryCardsRanking: Array<number>;
  cityCategoriesCarousel: TCityCategoriesCarousel;
  categoryLandingPageUrl: string;
};

export type CatAndSubCatPageProps = {
  catAndSubCatPageData: TCatAndSubCatPageData;
  breadcrumbs: TBreadcrumbs;
  primaryCity: Record<string, any>;
  isMobile: boolean;
};
