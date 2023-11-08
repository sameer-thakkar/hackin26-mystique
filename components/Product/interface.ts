export type TNextAvailableProps = {
  showSkeleton?: boolean;
  showCalendarIcon?: boolean;
  earliestAvailability?: any;
  currentLanguage?: any;
  inTitle?: boolean;
};

export type TBookNowCTAProps = {
  clickHandler: () => void;
  isMobile?: boolean;
  isInSidePanel?: boolean;
  ctaText: string;
  mbTheme?: string | null;
  width?: string;
  showLoadingState?: boolean;
};

export type TProductDescriptors = {
  descriptorArray: Array<string>;
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
};

export type TReviewProps = {
  reviewText?: string;
  children?: React.ReactNode;
  className?: string;
  isMobile?: boolean;
};
