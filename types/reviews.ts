export type TReviewMedia = {
  url: string;
  fileType: string;
  fileSize: number;
  width: number;
  height: number;
  fileName: string;
};

export type TTourGroupInfo = {
  id: string | number;
  url: string;
  name: string;
  urlText: string;
};

export type TReview = {
  id: number;
  tourId?: number;
  bookingId?: number;
  customerUserId?: number;
  title?: string | null;
  source?: string;
  nonCustomerName: string;
  nonCustomerCountryCode?: string | null;
  nonCustomerCountryName?: string | null;
  reviewerImgUrl?: string | null;
  rating: number;
  content: string;
  reviewTime: number;
  reviewMedias?: TReviewMedia[];
  translatedContent?: string | null;
  useTranslatedContent: boolean;
  sourceLanguage?: string | null;
  currentLanguage?: string;
  tourGroup?: TTourGroupInfo;
};

export type TReducedReviewWithMedia = {
  id?: number;
  nonCustomerName: string;
  reviewerImgUrl?: string | null;
  rating?: number;
  content?: string;
  reviewTime: number;
  reviewMedias: TReviewMedia[];
  translatedContent?: string | null;
  useTranslatedContent: boolean;
  nonCustomerCountryCode?: string | null;
  nonCustomerCountryName?: string | null;
};

export enum EReviewRatingFilter {
  GREATER_THAN_4 = 'GE_4',
  EQUAL_TO_3 = 'EQ_3',
  LESS_THAN_3 = 'LT_3',
}

export enum EReviewSortType {
  MOST_RELEVANT = 'MOST_RELEVANT',
  MOST_RECENT = 'MOST_RECENT',
}
