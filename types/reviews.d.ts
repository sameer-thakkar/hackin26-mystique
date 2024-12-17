import { TPaginationParams } from 'ReduxTypes/generics';

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

export type TResponse = TPaginationParams<TReview>;

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
