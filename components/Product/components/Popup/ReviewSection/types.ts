import type { TReviewMediasResponse } from 'utils/apiUtils';

export type TReviewSectionProps = {
  reviewsDetails: Record<string, any>;
  tgid: string | number;
  topReviews?: TReviewMediasResponse['items'];
  tourGroupUrl?: string;
  isMobile?: boolean;
};
