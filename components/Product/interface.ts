import { TDescriptorsList } from './components/NewVerticalsProductCard/types';

export type TNextAvailableProps = {
  showSkeleton?: boolean;
  showCalendarIcon?: boolean;
  earliestAvailability?: any;
  currentLanguage?: any;
  inTitle?: boolean;
  isExperimentalCard?: boolean;
  isDrawer?: boolean;
  forceMobileStyles?: boolean;
  isPopup?: boolean;
  flexible?: boolean;
  className?: string;
  showTime?: boolean;
};

export type TBookNowCTAProps = {
  clickHandler: () => void;
  isMobile?: boolean;
  isInSidePanel?: boolean;
  ctaText: string;
  mbTheme?: string | null;
  width?: string;
  showLoadingState?: boolean;
  isExperimentalCard?: boolean;
};

export type TProductDescriptors = {
  descriptorArray?: Array<string>;
  minDuration: number | null;
  maxDuration: number | null;
  lang: string;
  isGpMotorTicketsMb?: boolean;
  isLoading?: boolean;
  isCombo?: boolean;
  horizontal?: boolean;
  pageType?: string;
  uid?: string;
  showLanguages?: boolean;
  cancellationPolicy?: string;
  cancellationPolicyHoverCallBack?: () => void;
  showIcons?: boolean;
  isMobile?: boolean;
  showGuidedTourDescriptor?: boolean;
  customDescriptors?: TDescriptorsList[];
  allowClick?: boolean;
  forceMobile?: boolean;
  children?: React.ReactNode;
};

export type TProductHighlightTabs = {
  tabs?: any;
  hasRegularHighlights?: boolean;
  onTabChange: Function;
  pageType?: any;
  activeTabIndex?: number;
  showCard?: boolean;
  isLoading?: boolean;
  className?: string;
  controlHeight?: boolean;
};

export type TSpecialProductType = {
  Product: React.ReactNode;
  isMobile: boolean;
};

export type TSpecialGuidedTourSidePanelProps = {
  tgid: string;
  tourTitle: string;
  images: Array<{ url: string; altText: string }>;
  onSidePanelClose: () => void;
  highlightTabsComponent?: any;
  descriptorsList: any;
  minDuration: number | null;
  maxDuration: number | null;
  lang: string;
  showScratchPrice?: boolean;
  listingPrice: any;
  onBookNowClick: () => void;
  ctaText: string;
  showAvailabilityInTitle?: boolean;
  earliestAvailability?: any;
  productBookingUrl?: string;
  uid?: string;
  isShortcodePopup?: boolean;
};

export type TTourTittleProps = {
  isContentOpen?: boolean;
  pageType?: string;
  isLoading?: boolean;
  cardTitle: string;
  isMobile?: boolean;
  showAvailability?: boolean;
  isTicketCard?: boolean;
  hasBorderedTitle?: boolean;
  tabs?: [] | Record<string, any>;
  boosterTag?: boolean;
  mbTheme?: string | null;
  isOpenDated?: boolean;
  earliestAvailability?: any;
  currentLanguage?: any;
  isExperimentalCard?: boolean;
  isDrawer?: boolean;
  isPoiMwebCard?: boolean;
  showInfoIcon?: boolean;
  onClick?: () => void;
  isHOHORevamp?: boolean;
  forceMobile?: boolean;
};

export type TReviewProps = {
  reviewText?: string;
  children?: React.ReactNode;
  className?: string;
  isMobile?: boolean;
};

export type TRatingsContainerProps = {
  reviewsDetails?: {
    ratingsCount?: number;
    averageRating?: number;
    showRatings?: boolean;
  };
  onRatingsCountClick?: () => void;
};

export type TCategoryContainerProps = {
  primaryCategory?: any;
  primarySubCategory?: any;
};

export enum BoosterType {
  BESTSELLER = 'Best seller',
  SELLING_OUT_FAST = 'Selling out fast',
}

export type TBoosterProps = {
  type: BoosterType;
  rank?: number;
  isOverlay?: boolean;
};

export type TDiscountTagProps = {
  discount: string | number;
  showAngledTag?: boolean;
  shouldPointLeft?: boolean;
};
