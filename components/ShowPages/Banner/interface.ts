import { reviewDetailsType } from 'utils/schemaUtils';

interface IDescriptorsProp {
  code: string;
  name: string;
}

export interface ITourGroupDataProps {
  listingPrice: ListingPrice;
  name: string;
  primaryCategory: PrimaryCategory;
  primarySubCategory: PrimarySubCategory;
  primaryCollection: PrimaryCollecton;
  reviewCount: number;
  flowType: string;
  descriptors?: Array<IDescriptorsProp>;
  reviewsDetails?: reviewDetailsType;
  imageUploads?: Array<Media>;
}

export interface IShowPageBannerProps {
  detailsObjects: Record<string, any>;
  tgid: string;
  uid: string;
  isMobile: boolean;
  tourGroupData: ITourGroupDataProps;
  currentLanguage: string;
  tagsArray: Array<string>;
  hostname: string;
  hasSpecialOffer: boolean;
  isProd: boolean;
  hasSellBackListings?: boolean;
  onScrollToSeatMap?: () => void;
}
