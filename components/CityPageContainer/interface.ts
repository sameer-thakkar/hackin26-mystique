import { MouseEvent } from 'react';

export interface IHandleCarouselControlTracking {
  direction: string;
  section: string;
}
interface ICommonProps {
  lang: string;
  host: string;
  isMobile: boolean;
  isDev: boolean;
}
export interface ICity {
  uid: string;
  prismicData: {
    taggedCity: string;
    taggedCountry: string;
    bannerImages: PrismicBannerItem[];
  };
  cityHOData: Record<string, any>;
}
export interface CityGuideObject {
  uid: string;
  primaryTag: string;
}

export interface ICityGuide extends ICommonProps {
  mbCityDisplayName: string;
  cityGuideData: CityGuideObject[];
}

export interface INearbyCities extends ICommonProps {
  cities: ICity[];
}
export interface ICollectionItem {
  uid: string;
  heading: string;
  cardImageUrl: string;
  id: number;
  name: string;
  cardMedia: Record<string, any>;
}

interface ITopCollectionsData {
  allDayTripPage: Record<string, string>;
  nearbyTopCollections: ICollectionItem[];
}
export interface IBeyondCity extends ICommonProps {
  mbCityDisplayName: string;
  nearbyTopCollectionsData: ITopCollectionsData;
}
export interface IPagelinkProps {
  uid: string;
  lang: string;
  host: string;
  isDev: boolean;
}

export interface ICityTopCollectionsItem {
  id: number;
  heading: string;
  cardImageUrl: string;
  uid: string;
  startingPrice: Record<string, any>;
  name: string;
  cardMedia: Record<string, any>;
}

export interface ICityTopAttractions extends ICommonProps {
  cityTopCollectionsData: ICityTopCollectionsItem[];
}

//popular categories props
export interface IPopularEntity {
  uid: string;
  heading: string;
  medias: Media[];
}
export interface IPopularCategories extends ICommonProps {
  popularEntities: IPopularEntity[];
}
//end

//explore section
export interface ICarouselChild {
  id: number;
  uid: string;
  heading: string;
  cardImageUrl: string;
  medias: Media[];
  name: string;
  categoryId?: number;
  cardMedia?: Record<string, any>;
}
export interface IExploreCarouselEntity {
  children: ICarouselChild[];
  parentData: Record<string, any>;
  type: string;
  cityPageRank: number;
}

export interface ICatSubCatSectionProps
  extends ICommonProps,
    IExploreCarouselEntity {}
export interface IExploreSectionData {
  categoriesData: Record<string, IExploreCarouselEntity>;
  subCategoriesData: Record<string, IExploreCarouselEntity>;
}
export interface IExploreCity extends ICommonProps {
  mbCityDisplayName: string;
  exploreSectionData: IExploreSectionData;
}

export interface IExploreCityCardClick {
  event: MouseEvent<HTMLAnchorElement>;
  url: string;
  rank: number;
  name: string;
  id: number;
  categoryId?: number;
  type: string;
  sectionName: string;
}
//end

//banner
export interface IBannerItem {
  url: string;
  type: string;
  metadata: Record<string, string>;
  info: Record<string, string>;
}
export interface ICtyPageBannerData {
  banners: IBannerItem[];
}

export interface PrismicBannerItem {
  alt: string;
  url: string;
}
export interface IVideoBanner {
  currentCityData: ICurrentCityData;
  cityPageBannerData: ICtyPageBannerData;
  prismicBannerImages: PrismicBannerItem[];
}

export interface IBannerParams {
  videoUrl: string;
  videoFallbackUrl: string;
  altText: string;
}
//end
export interface ICurrentCityData {
  displayName: string;
  country: {
    displayName: string;
  };
}
export interface ICityPageProps extends ICommonProps {
  prismicBannerImages: PrismicBannerItem[];
  cityPageData: {
    nearbyAndCurrentCityData: {
      nearbyCitiesData: ICity[];
      currentCityData: ICurrentCityData;
    };
    cityGuideData: CityGuideObject[];
    nearbyTopCollectionsData: ITopCollectionsData;
    cityTopCollectionsData: ICityTopCollectionsItem[];
    categoriesData: {
      popularEntities: IPopularEntity[];
      exploreSectionData: IExploreSectionData;
    };
    cityPageBannerData: ICtyPageBannerData;
  };
}

//tracking
export interface ICardTrackingEvent {
  e: MouseEvent<HTMLAnchorElement>;
  link: string;
  rank: number;
  name: string;
}
export interface IGuideCardClick {
  link: string;
  rank: number;
  name: string;
}
export interface ICollectionCardTracking {
  event: MouseEvent<HTMLAnchorElement>;
  url: string;
  rank: number;
  name: string;
  id: number;
  section: string;
}
export interface ISubCatCardTracking extends ICollectionCardTracking {
  categoryId: number;
}
export interface ITrackCTA {
  event: MouseEvent<HTMLAnchorElement>;
  url: string;
  section: string;
  ctaType: string;
}
export interface ITrackPageSection {
  section: string;
}
//

export interface Media {
  type: string;
  url: string;
  metadata: {
    altText: string;
  };
}
export interface IgetCatSubCatMedia {
  medias: Media[];
}
