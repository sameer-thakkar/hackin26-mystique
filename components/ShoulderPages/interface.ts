import { TBreadcrumbs } from 'utils/breadcrumbsUtils';

export interface IShoulderBannerProps {
  imageSrc?: {
    url?: string;
    alt?: string;
  };
  title?: string;
  description?: string;
  poiInfo?: {};
}

export interface IMessageBoxProps {
  list?: { content?: string }[];
  CTALink?: string;
}

export type TQuickInfo = {
  [key: string]: {
    value?: string;
    Icon: () => JSX.Element;
    url?: string;
  };
};

export interface IQuickInfoProps {
  id: string;
  info: TQuickInfo;
  CTALink?: string;
}
export interface IAboutPageProps {
  data: Record<string, any>;
  featuredImage?: Record<string, any>;
  breadcrumbs?: TBreadcrumbs;
  taggedCity?: string | null;
  primaryCity?: Record<string, any>;
  isMobile?: boolean;
  relatedContentPages?: Record<string, any>[];
  poiInfo?: Record<string, any>;
  automatedBreadcrumbsExists?: boolean;
  extractedBreadcrumbsSlice?: Record<string, any>[];
  extractedProductCardsSlice?: Record<string, any>[];
  categoryTourListData?: Record<string, any>;
  parentProps: any;
}

export interface IGeneralContentPageProps {
  featuredImage?: {
    url: string;
    alt: string;
  };
  alertPopup: Record<string, any>;
  currentLanguage?: string;
  selectedHeading?: string;
  data: Record<string, any>;
  breadcrumbs?: TBreadcrumbs;
  taggedCity?: string | null;
  primaryCity?: Record<string, any>;
  isMobile?: boolean;
  automatedBreadcrumbsExists?: boolean;
  parentProps?: Record<string, any>;
}
